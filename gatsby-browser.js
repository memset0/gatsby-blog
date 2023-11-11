require("./src/style/animation.less");
require("./src/style/custom.css");
require("./src/style/typography.less");
require("./src/style/highlight.css");

const React = require("react");
const { useContext } = React;
const Layout = require("./src/components/Layout").default;
const LayoutContext = require("./src/components/LayoutContext").default;

exports.onPreRouteUpdate = () => {
  console.log("[Gatsby]", "onPreRouteUpdate");
};

exports.onRouteUpdate = () => {
  const unsafeWindow = typeof window === "undefined" ? {} : window;
  const { setMobileOpen } = unsafeWindow;
  if (setMobileOpen) {
    setMobileOpen(false); // 切换页面时自动关闭Mobile端打开的drawer
    console.log("[hack]", "close mobile drawer");
  }
  console.log("[Gatsby]", "onRouteUpdate");
};

// 避免在页面内切换时重新挂载Layout组件
exports.wrapPageElement = ({ element, props }) => {
  return React.createElement(Layout, props, element);
};
