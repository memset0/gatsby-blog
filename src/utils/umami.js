export const umamiConfig = {
  websiteId: "e0782534-a92a-4374-9289-b3a902bb589f",
  srcUrl: "https://umami.memset0.cn/script.js",
};

export function track(props) {
  const unsafeWindow = typeof window === "undefined" ? {} : window;
  const umami = unsafeWindow.umami;
  console.log("umami", unsafeWindow, unsafeWindow.umami);
  if (umami) {
    console.log("[umami]", "track", props);
    umami.track(props);
  }
}
