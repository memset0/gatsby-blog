/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`);
const { createFilePath, createRemoteFileNode } = require(`gatsby-source-filesystem`);
const { paginate } = require("gatsby-awesome-pagination");

const { flatCategories } = require("./src/utils/category");
const categories = require("./src/data/categories");
const flattedCategories = flatCategories(categories);

const postListTemplate = path.resolve("./src/templates/post-list.js");
const postTemplate = path.resolve("./src/templates/post.js");
const docTemplate = path.resolve("./src/templates/doc.js");

const POSTS_PER_PAGE = 10;

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
          frontmatter {
            title
            menu
            publish
          }
          fields {
            slug
            isDoc
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`There was an error loading your blog posts`, result.errors);
    return;
  }

  const posts = result.data.allMarkdownRemark.nodes;
  // require("fs").writeFileSync(
  //   require("path").join(__dirname, "./tmp/posts.json"),
  //   JSON.stringify(posts, null, 2)
  // );
  const folders = {};
  for (const post of posts) {
    if (post.frontmatter.publish && post.fields.slug) {
      const patterns = post.fields.slug.split("/");
      for (let i = 2; i + 1 < patterns.length; i++) {
        const folder = patterns.slice(0, i).join("/");
        if (folder in folders) {
          folders[folder].push(post);
        } else {
          folders[folder] = [post];
        }
      }
    }
  }

  // 创建主页
  paginate({
    createPage,
    items: posts.filter(post => post.frontmatter.publish),
    itemsPerPage: POSTS_PER_PAGE,
    pathPrefix: "/",
    component: postListTemplate,
    context: {
      pathPrefix: "/",
      prefixRegex: "^/",
      names: "[]",
      format: "index",
    },
  });

  // 创建每个分类的页面
  const categoryPages = [];
  const walkCategory = (node, uri, names) => {
    console.log("#walk", node, uri, names);
    for (const key in node) {
      names.push(node[key].name);
      categoryPages.push({
        uri: `${uri}/${key}`,
        names: JSON.stringify(names),
      });
      if (node[key].children) {
        walkCategory(node[key].children, `${uri}/${key}`, names);
      }
      names.pop();
    }
  };
  walkCategory(categories, "", []);
  for (const { uri, names } of categoryPages) {
    if (Object.keys(folders).includes(uri)) {
      paginate({
        createPage,
        items: folders[uri],
        itemsPerPage: POSTS_PER_PAGE,
        pathPrefix: uri,
        component: postListTemplate,
        context: {
          pathPrefix: `${uri}/`,
          prefixRegex: `^${uri}/`,
          names,
          format: "index",
        },
      });
    }
  }

  // 创建每篇博文/文档的页面
  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id;
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id;

      createPage({
        path: post.fields.slug,
        component: post.fields.isDoc ? docTemplate : postTemplate,
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
let cachedNodes = null;
exports.onCreateNode = async ({ node, actions, getNode, getNodes, createNodeId, cache, store }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode });

    const getNodeByPath = (resolvedPath, retried = false) => {
      if (!cachedNodes) {
        cachedNodes = getNodes();
      }
      for (const node of cachedNodes) {
        if (node.absolutePath && path.resolve(node.absolutePath) === resolvedPath) {
          return node;
        }
      }
      if (!retried) {
        cachedNodes = null;
        return getNodeByPath(resolvedPath, true);
      }
      return null;
    };

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });

    // 判断当前文件是不是文档
    let isDoc = false;
    for (const category of flattedCategories) {
      if (slug.startsWith(category.slug)) {
        if (category.node.doc) {
          isDoc = true;
        }
      }
    }
    if (isDoc) {
      createNodeField({
        node,
        name: "isDoc",
        value: isDoc,
      });
    }

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
        const resolvedCoverPath = path.resolve(__dirname, "./content/cover/", coverPath);
        fileNode = getNodeByPath(resolvedCoverPath);
      }

      if (fileNode) {
        createNodeField({
          node,
          name: "cover___NODE",
          value: fileNode.id,
        });
        // node.frontmatter.cover___NODE = fileNode.id;
      }
    }

    const category = [];
    let currentCategory = categories;
    let categoryUri = "/";
    for (const pattern of slug.split("/").slice(1, -1)) {
      if (currentCategory && pattern in currentCategory) {
        categoryUri += pattern + "/";
        category.push({
          name: currentCategory[pattern].name,
          to: categoryUri,
        });
        currentCategory = currentCategory[pattern].children;
      } else {
        break;
      }
    }
    createNodeField({
      node,
      name: "category",
      value: JSON.stringify(category),
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
