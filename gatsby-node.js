/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const fs = require("fs");
const path = require("path");
const yaml = require("yaml");
const { createFilePath, createRemoteFileNode } = require(`gatsby-source-filesystem`);
const { paginate } = require("gatsby-awesome-pagination");

const { parseNav } = require("./src/utils/nav");

const { flatCategories } = require("./src/utils/category");
const categories = require("./src/data/categories");
const flattedCategories = flatCategories(categories);

const postListTemplate = path.resolve("./src/templates/post-list.js");
const postTemplate = path.resolve("./src/templates/post.js");

const POSTS_PER_PAGE = 10;

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // 获取所有按日期排序的markdown博客文章
  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: ASC } }) {
        nodes {
          id
          frontmatter {
            title
            hide
          }
          fields {
            slug
            isDoc
            isPublished
            navJson
          }
        }
      }
    }
  `);
  if (result.errors) {
    reporter.panicOnBuild(`There was an error loading your blog posts`, result.errors);
    return;
  }
  let posts = result.data.allMarkdownRemark.nodes;
  // require("fs").writeFileSync(
  //   require("path").join(__dirname, "./tmp/posts.json"),
  //   JSON.stringify(posts, null, 2)
  // );

  const folders = {};
  for (const post of posts) {
    if (post.fields.isPublished && post.fields.slug) {
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

  // 获取所有分类
  const categoryPages = [];
  const walkCategory = (node, uri, names) => {
    // console.log("#walk", node, uri, names);
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

  // console.log(posts.map(post => post.frontmatter.title));
  // console.log(posts.filter(post => post.fields.isPublished).map(post => post.frontmatter.title));
  // 创建主页
  paginate({
    createPage,
    items: posts.filter(post => post.fields.isPublished),
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
  posts = posts.filter(post => !post.frontmatter.hide); // 如果hide为真则不创建页面
  if (posts.length > 0) {
    const allNavJson = [];
    for (const post of posts) {
      if (post.fields.navJson) {
        allNavJson.push({
          slug: post.fields.slug,
          navJson: post.fields.navJson,
        });
      }
    }

    function findNavJson(slug) {
      let result = null;
      let matchLength = 0;
      for (const navJson of allNavJson) {
        if (slug.startsWith(navJson.slug) && navJson.slug.length > matchLength) {
          result = navJson.navJson;
          matchLength = navJson.slug.length;
        }
      }
      return result;
    }

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];

      let previousPostId = null;
      let nextPostId = null;
      if (post.fields.isPublished) {
        // 如果当前文章的isPublished为真，则自动寻找前一篇和后一篇文章
        for (let j = i - 1; j >= 0; j--) {
          if (posts[j].fields.isPublished) {
            previousPostId = posts[j].id;
            break;
          }
        }
        for (let j = i + 1; j < posts.length; j++) {
          if (posts[j].fields.isPublished) {
            nextPostId = posts[j].id;
            break;
          }
        }
      }

      let navJson = "";
      if (post.fields.isDoc) {
        // 如果isDoc为真,则需要生成侧边导航栏,信息通过navJson参数传递
        navJson = findNavJson(post.fields.slug);
      }

      createPage({
        path: post.fields.slug,
        component: postTemplate,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
          navJson,
        },
      });
    }
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

    const getNodeByPath = resolvedPath => {
      for (const node of getNodes()) {
        if (node.absolutePath && path.resolve(node.absolutePath) === resolvedPath) {
          return node;
        }
      }
      return null;
    };

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });

    // 处理cssstyles
    let cssclasses = [];
    if (node.frontmatter.cssclasses) {
      cssclasses.push(node.frontmatter.cssclasses);
    }
    if (node.frontmatter["blog-cssclasses"]) {
      cssclasses.push(node.frontmatter["blog-cssclasses"]);
    }
    cssclasses = cssclasses.flat();
    if (cssclasses.length > 0) {
      createNodeField({
        node,
        name: "cssclasses",
        value: cssclasses,
      });
    }

    // 判断当前文件是不是文档,如果是文档,则field isDoc为真isDoc
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

    let isPublished = false;
    if (
      node.frontmatter.publish || //
      node.frontmatter["published-title"] ||
      node.frontmatter.publishedTitle
    ) {
      isPublished = true;
    }
    if (
      !node.frontmatter.date || // 如果date为空，则一定不发布
      node.frontmatter.hide // 如果hide为真，则一定不发布
    ) {
      isPublished = false;
    }
    if (isPublished) {
      createNodeField({
        node,
        name: "isPublished",
        value: isPublished,
      });
      createNodeField({
        node,
        name: "publishedTitle",
        value:
          node.frontmatter["published-title"] || //
          node.frontmatter.publishedTitle ||
          node.frontmatter.title,
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
      }
    }

    if (node.frontmatter.nav) {
      const parsedNav = parseNav(path.dirname(node.fileAbsolutePath), slug, node.frontmatter.nav);
      createNodeField({
        node,
        name: "navJson",
        value: JSON.stringify(parsedNav), // 在创建时处理并转化成字符串，否则无论是模板还是创建页面时都无法用GraphQL查询到
      });
    }

    const props = [];
    if (node.frontmatter.props) {
      for (const el of Object.entries(node.frontmatter.props)) {
        props.push({
          key: el[0],
          value: el[1],
        });
      }
    }
    if (props.length > 0) {
      createNodeField({
        node,
        name: "propsJson",
        value: JSON.stringify(props),
      });
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
 * @type {import('gatsby').GatsbyNode['createResolvers']}
 */
exports.createResolvers = ({ createResolvers, cache, store, actions, createNodeId }) => {
  createResolvers({
    Site: {
      friends: {
        type: ["Friend"],
        resolve: async ({ node }) => {
          const filePath = path.resolve(__dirname, "./content/friends.yml");
          const friends = yaml.parse(fs.readFileSync(filePath, "utf-8").toString());
          // console.log(friends);
          for (const friend of friends) {
            friend.avatar = await createRemoteFileNode({
              url: friend.avatarUrl,
              // parentNodeId: node.id,
              createNode: actions.createNode,
              createNodeId,
              cache,
              store,
            });
          }
          // console.log(friends);
          return friends;
        },
      },
    },
  });
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
      cssclasses: [String]
      isDoc: Boolean
      isPublished: Boolean
      publishedTitle: String
      navJson: String
      propsJson: String
      category: String
    }
    
    type Friend implements Node {
      link: String
      name: String
      bio: String
      avatar: File
      avatarUrl: String
    }
  `);
};

/**
 * @type {import('gatsby').GatsbyNode['onCreateWebpackConfig']}
 */
exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage === `build-javascript`) {
    actions.setWebpackConfig({
      devtool: false,
    });
  }
};
