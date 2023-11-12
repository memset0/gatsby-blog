require("./src/style/animation.less");
require("./src/style/custom.less");
require("./src/style/typography.less");
require("./src/style/highlight.css");

const React = require("react");
const Layout = require("./src/components/Layout").default;

exports.onPreRouteUpdate = () => {
  const unsafeWindow = typeof window === "undefined" ? {} : window;
  console.log("[Gatsby]", "onPreRouteUpdate", unsafeWindow.location?.pathname);
};

exports.onRouteUpdate = () => {
  const unsafeWindow = typeof window === "undefined" ? {} : window;
  const { setMobileOpen } = unsafeWindow;
  if (setMobileOpen) {
    setMobileOpen(false); // 切换页面时自动关闭Mobile端打开的drawer
    console.log("[hack]", "close mobile drawer");
  }
  console.log("[Gatsby]", "onRouteUpdate", unsafeWindow.location?.pathname);
};

// 避免在页面内切换时重新挂载Layout组件
exports.wrapPageElement = ({ element, props }) => {
  return React.createElement(Layout, props, element);
};
