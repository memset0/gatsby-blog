let offsetY = 0;

const getTargetOffset = hash => {
  const id = window.decodeURI(hash.replace(`#`, ``));
  console.log("[autolink-headers] get target offset", hash, offsetY);
  if (id !== ``) {
    const element = document.getElementById(id);
    if (element) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      const clientTop = document.documentElement.clientTop || document.body.clientTop || 0;
      const computedStyles = window.getComputedStyle(element);
      const scrollMarginTop =
        computedStyles.getPropertyValue(`scroll-margin-top`) ||
        computedStyles.getPropertyValue(`scroll-snap-margin-top`) ||
        `0px`;
      console.log("[autolink-headers] get target offset", {
        id,
        element,
        getBoundingClientRect: element.getBoundingClientRect(),
        scrollTop,
        clientTop,
        computedStyles,
        scrollMarginTop,
      });
      console.log("[autolink-headers] get target offset", {
        goal: element.offsetTop,
        now: document.documentElement.scrollTop + document.body.scrollTop,
        result: element.offsetTop + scrollTop - parseInt(scrollMarginTop, 10) - clientTop - offsetY,
      });

      return (
        element.getBoundingClientRect().top + scrollTop - parseInt(scrollMarginTop, 10) - clientTop - offsetY
      );
    }
  }
  return null;
};

exports.onInitialClientRender = (_, pluginOptions) => {
  if (pluginOptions.offsetY) {
    offsetY = pluginOptions.offsetY;
  }
  console.log("[autolink-headers] onInitialClientRender");

  requestAnimationFrame(() => {
    const offset = getTargetOffset(window.location.hash);
    if (offset !== null) {
      console.log("[autolink-headers] requestAnimationFrame", offset);
      window.scrollTo(0, offset);
    }
  });
};

exports.shouldUpdateScroll = ({ routerProps: { location } }) => {
  console.log("[autolink-headers] shouldUpdateScroll");
  const offset = getTargetOffset(location.hash);
  console.log("[autolink-headers] shouldUpdateScroll offset:", offset);
  return offset !== null ? [0, 0] : true;
};
