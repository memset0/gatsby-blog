import React, { useContext } from "react";
import { CSSTransition } from "react-transition-group";
import Container from "@mui/material/Container";
import LayoutContext from "../components/LayoutContext";

import siteMetadata from "../data/metadata";
import { trackPathname } from "../utils/umami";

const Main = ({ title, maxWidth, location, children, navJson }) => {
  // 读取上次滚动位置
  if (typeof window !== "undefined") {
    const unsafeWindow = typeof window === "undefined" ? {} : window;
    if (typeof unsafeWindow.cachedScrollTop === "undefined") {
      unsafeWindow.cachedScrollTop = {};
    }
    const pathname = (location || {}).pathname || "#";
    const { document, lastPathname, cachedScrollTop } = unsafeWindow;
    if (lastPathname !== pathname) {
      const scrollTop = cachedScrollTop[pathname];
      if (document && document.getElementById("main")) {
        document.getElementById("main").scrollTop = scrollTop || 0;
      }
    }
    unsafeWindow.lastPathname = pathname;
  }

  const { setTitle, setNavJson, setPathname } = useContext(LayoutContext);
  title = title || siteMetadata.title;
  setTitle(title);
  setNavJson(navJson || "");
  setPathname(location.pathname);

  // umami 跟踪
  console.log("[umami] Main component re-rendered!!!");
  trackPathname(location.pathname, title);
  React.useEffect(() => {
    setTimeout(() => trackPathname(location.pathname, title), 1000);
  }, []);

  const [showMain, setShowMain] = React.useState(false);
  React.useEffect(() => {
    setShowMain(true);
  }, []);

  return (
    <CSSTransition in={showMain} timeout={200} classNames="fade">
      <div style={{ opacity: "0" }}>
        <Container maxWidth={maxWidth || "lg"} sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </div>
    </CSSTransition>
  );
};

export default Main;
