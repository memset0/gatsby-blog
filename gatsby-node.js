/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`);
const {
  createFilePath,
  createRemoteFileNode,
  createFileNodeFromBuffer,
} = require(`gatsby-source-filesystem`);

// Define the template for blog post
const blogPost = path.resolve(`./src/templates/blog-post.js`);

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: ASC } }) {
        nodes {
          id
          fields {
            slug
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    );
    return;
  }

  const posts = result.data.allMarkdownRemark.nodes;

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id;
      const nextPostId =
        index === posts.length - 1 ? null : posts[index + 1].id;

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      });
    });
  }
};

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = async ({
  node,
  actions,
  getNode,
  getNodes,
  createNodeId,
  cache,
  store,
}) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode });

    const getNodeByPath = resolvePath => {
      for (const node of getNodes()) {
        if (
          node.absolutePath &&
          path.resolve(node.absolutePath) === resolvePath
        ) {
          return node;
        } else {
          // console.log(node.absolutePath, resolvePath);
        }
      }
      return null;
    };

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });

    const coverPath = node.frontmatter.cover;
    if (coverPath) {
      let fileNode;
      if (coverPath.startsWith("http://") || coverPath.startsWith("https://")) {
        // 说明cover在远程网站，使用createRemoteFileNode方法创建文件节点
        fileNode = await createRemoteFileNode({
          url: coverPath,
          parentNodeId: node.id,
          createNode: actions.createNode,
          createNodeId,
          cache,
          store,
        });
      } else {
        // 说明cover在本地，使用getNode方法获得gatsby-source-filesystem插件创建好的节点
        const resolvedCoverPath = path.resolve(
          __dirname,
          "./content/cover/",
          coverPath
        );
        fileNode = getNodeByPath(resolvedCoverPath);
      }
      console.log(fileNode);

      if (fileNode) {
        createNodeField({
          node,
          name: "cover___NODE",
          value: fileNode.id,
        });
        // node.frontmatter.cover___NODE = fileNode.id;
      }
    }
    createNodeField({
      node,
      name: `hasCover`,
      value: !!coverPath,
    });
  }
};

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `);
};
