export const umamiConfig = {
  websiteId: "e0782534-a92a-4374-9289-b3a902bb589f",
  srcUrl: "https://umami.memset0.cn/script.js",
};

export function getUmami() {
  const unsafeWindow = typeof window === "undefined" ? {} : window;
  const umami = unsafeWindow.umami;
  if (umami) {
    return umami;
  }
  const logUninitialized = () => console.log("[umami]", "uninitialized");
  return { track: logUninitialized, identity: logUninitialized, unload: true };
}

export function track(props) {
  const umami = getUmami();
  if (umami.unload) {
    return;
  }
  console.log("[umami]", "track", props);
  umami.track(props);
}

export function trackPathname(pathname, title) {
  const umami = getUmami();
  if (umami.unload) {
    return;
  }
  if (umami.lastPathname && umami.lastPathname === pathname) {
    console.log("[umami]", "skipped:", pathname);
    return;
  }
  console.log("[umami]", "tracking...", { pathname, title });
  umami.lastPathname = pathname;
  umami.track(props => ({ ...props, url: pathname, title }));
}
