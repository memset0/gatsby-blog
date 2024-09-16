import React, { useContext } from "react";
import { CSSTransition } from "react-transition-group";
import Container from "@mui/material/Container";
import LayoutContext from "../components/LayoutContext";

import scrollUtils from "../utils/scroll";
import siteMetadata from "../data/metadata";
import { registerUmami, trackPathname } from "../utils/umami";
import { animationDuration } from "../data/preset";

const Main = ({ title, maxWidth, location, children, navJson }) => {
  // 读取上次滚动位置
  scrollUtils.loadLastScrollTop();

  const { setTitle, setNavJson, setPathname } = useContext(LayoutContext);
  title = title || siteMetadata.title;
  setTitle(title);
  setNavJson(navJson || "");
  setPathname(location.pathname);

  // umami跟踪器
  // console.log("[umami] Main component re-rendered!!!");
  trackPathname(location.pathname, title);
  React.useEffect(() => {
    // console.log("[umami] Main component useEffect():");
    registerUmami(() => trackPathname(location.pathname, title));
  }, [location, title]);

  const [showMain, setShowMain] = React.useState(false);
  React.useEffect(() => {
    setShowMain(true);
  }, []);

  return (
    <CSSTransition in={showMain} timeout={animationDuration} classNames="fade">
      <div style={{ opacity: "0" }}>
        <Container maxWidth={maxWidth || "lg"} sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </div>
    </CSSTransition>
  );
};

export default Main;
