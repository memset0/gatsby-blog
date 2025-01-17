/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

const React = require("react");

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
exports.onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: `zh-CN` });

  setHeadComponents([
    <link
      href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.css"
      rel="stylesheet"
      crossOrigin="anonymous"
      key="LxgwFont"
    />,
  ]);

  // setHeadComponents([
  //   <link
  //     href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/katex.min.css"
  //     rel="stylesheet"
  //     crossOrigin="anonymous"
  //     key="katexStyle"
  //   />,
  // ]);
};
