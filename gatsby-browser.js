require("./src/style/animation.less");
require("./src/style/custom.css");
require("./src/style/typography.less");
require("./src/style/highlight.css");

exports.onPreRouteUpdate = () => {
  console.log("onPreRouteUpdate");
  const body = document.querySelector("body");
  body.classList.add("no-animation");
};

exports.onRouteUpdate = () => {
  console.log("onRouteUpdate");
  const body = document.querySelector("body");
  body.classList.remove("no-animation");
};
