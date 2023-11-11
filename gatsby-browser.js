require("./src/style/animation.less");
require("./src/style/custom.css");
require("./src/style/typography.less");
require("./src/style/highlight.css");

exports.onPreRouteUpdate = () => {
  console.log("[Gatsby]", "onPreRouteUpdate");
};

exports.onRouteUpdate = () => {
  console.log("[Gatsby]", "onRouteUpdate");
};

// 避免在页面内切换时重新挂载Layout组件
const React = require("react");
const Layout = require("./src/components/Layout").default;
exports.wrapPageElement = ({ element, props }) => {
  return React.createElement(Layout, props, element);
};
