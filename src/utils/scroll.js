import { smoothScrollTo } from "./smoothscroll";

function isClient() {
  return typeof window !== "undefined";
}

function initCustomScroll() {
  if (typeof window.__mem_cachedScrollTop === "undefined") {
    window.__mem_cachedScrollTop = {};
  }

  window.pageYOffset = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function customScrollTo(scrollTop, smooth = false) {
  if (!isClient()) {
    return;
  }
  initCustomScroll();

  scrollTop = scrollTop || 0;
  const { location, __mem_cachedScrollTop } = window;
  __mem_cachedScrollTop[location.pathname] = scrollTop;

  if (!smooth) {
    if (!document || !document.getElementById("main")) {
      return;
    }
    document.getElementById("main").scrollTop = scrollTop;
    return;
  }

  smoothScrollTo(document.getElementById("main"), scrollTop, 500);
}

export function registerScrollListener() {
  if (!isClient()) {
    return;
  }
  initCustomScroll();

  let lastScrollTop = 0;
  document.getElementById("main").addEventListener("scroll", () => {
    const scrollTop = document.getElementById("main").scrollTop;
    if (Math.abs(scrollTop - lastScrollTop) > 1) {
      const { location, __mem_cachedScrollTop } = window;
      __mem_cachedScrollTop[location.pathname] = scrollTop;
      lastScrollTop = scrollTop;
    }
  });
}

export function loadLastScrollTop() {
  if (!isClient()) {
    return;
  }
  initCustomScroll();

  const { location, __mem_lastPathname, __mem_cachedScrollTop } = window;
  if (__mem_lastPathname !== location.pathname) {
    customScrollTo(__mem_cachedScrollTop[location.pathname]);
  }
  window.__mem_lastPathname = location.pathname;
}

const scrollUtils = {
  registerScrollListener,
  loadLastScrollTop,
};
export default scrollUtils;
