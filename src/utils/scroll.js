import { smoothScrollTo } from "./smoothscroll";
import { randomString } from "./random";

import { useEffect, useState } from "react";

export function useScrollTop() {
  const [scrollTop, setScrollTop] = useState(0);
  useEffect(() => {
    function scrollFn(currentScrollTop) {
      // console.log("[scroll] scrollFn:", currentScrollTop);
      setScrollTop(currentScrollTop);
    }
    const listenerId = addScrollListener(scrollFn);
    return () => {
      removeScrollListener(listenerId);
    };
  }, []);
  return [scrollTop, setScrollTop];
}

const onScroll = [];

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

export function addScrollListener(callback) {
  const id = randomString(16);
  onScroll.push({
    id,
    callback,
  });
  return id;
}

export function removeScrollListener(id) {
  for (let i = 0; i < onScroll.length; i++) {
    if (onScroll[i].id === id) {
      onScroll.splice(i, 1);
      return true;
    }
  }
  return false;
}

export function getScrollTop() {
  if (!isClient()) {
    return -1;
  }
  initCustomScroll();

  if (!document || !document.getElementById("main")) {
    return -1;
  }
  return document.getElementById("main").scrollTop;
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

export function registerGlobalListener() {
  if (!isClient()) {
    return;
  }
  initCustomScroll();

  let lastScrollTop = 0;
  document.getElementById("main").addEventListener("scroll", () => {
    const scrollTop = document.getElementById("main").scrollTop;
    if (Math.abs(scrollTop - lastScrollTop) > 10) {
      for (let i = 0; i < onScroll.length; i++) {
        onScroll[i].callback(scrollTop);
      }
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
  registerGlobalListener,
  loadLastScrollTop,
};
export default scrollUtils;
