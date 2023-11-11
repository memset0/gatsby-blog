import React from "react";
import { CSSTransition } from "react-transition-group";
import { styled, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppBarContent from "./Layout/AppBarContent";
import DrawerContent from "./Layout/DrawerContent";
import Footer from "./Layout/Footer";
import LayoutContext from "./LayoutContext";

import theme from "../theme";
import siteMetadata from "../data/metadata";

export const drawerWidth = 220;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open",
})(({ theme, open, isdesktop }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: isdesktop === "true" ? `calc(100% - ${drawerWidth}px)` : "100%",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const PermanentDrawer = styled(Drawer, {
  shouldForwardProp: prop => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
    }),
  },
}));

const Layout = ({ children }) => {
  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [title, setTitle] = React.useState(siteMetadata.title);

  const isDesktop = useMediaQuery(() => theme.breakpoints.up("md"));
  const toggleDrawer = () => setOpen(!open);
  const toggleMobileDrawer = () => setMobileOpen(!mobileOpen);

  const isSSR = typeof window === "undefined";
  const container = isSSR ? undefined : window.document.body;

  // 用于控制AppBar出现动画
  const [showAppBar, setShowAppBar] = React.useState(false);
  React.useEffect(() => {
    setShowAppBar(true);
  }, []);

  return (
    <LayoutContext.Provider value={{ title, setTitle }}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />

          <CSSTransition
            in={showAppBar}
            timeout={500}
            classNames="appbar-float"
          >
            <div
              style={{
                position: "fixed",
                top: "-68px",
                left: "0px",
                width: "100%",
                zIndex: "20040214",
              }}
            >
              <AppBar
                position="absolute"
                open={open}
                isdesktop={(!!isDesktop).toString()}
              >
                <Toolbar sx={{ pr: "24px" }}>
                  {/* Appbar 菜单按钮 */}
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={isDesktop ? toggleDrawer : toggleMobileDrawer}
                    sx={{ marginRight: { xs: "12px", md: "24px" } }}
                  >
                    <MenuIcon
                      sx={{
                        display: { xs: "block", md: open ? "none" : "block" },
                      }}
                    />
                    <ChevronLeftIcon
                      sx={{
                        display: { xs: "none", md: !open ? "none" : "block" },
                      }}
                    />
                  </IconButton>

                  <AppBarContent title={title} />
                </Toolbar>
              </AppBar>
            </div>
          </CSSTransition>

          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={toggleMobileDrawer}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            <DrawerContent />
          </Drawer>

          <PermanentDrawer
            anchor="left"
            variant="permanent"
            open={open}
            sx={{
              display: { xs: "none", md: "block" },
            }}
          >
            <DrawerContent />
          </PermanentDrawer>

          <Box
            component="main"
            sx={{
              backgroundColor: theme =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />

            {/* 这里进入页面主体 */}
            {children}

            {/* 这里放页脚啦~ */}
            <Footer />
          </Box>
        </Box>
      </ThemeProvider>
    </LayoutContext.Provider>
  );
};

export default Layout;
