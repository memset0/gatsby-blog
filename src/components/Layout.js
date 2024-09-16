import React from "react";
import { CSSTransition } from "react-transition-group";
import { styled, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NoSsr from "@mui/material/NoSsr";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import AppBar from "@mui/material/AppBar";
import Popover from "@mui/material/Popover";
import Backdrop from "@mui/material/Backdrop";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListIcon from "@mui/icons-material/List";
import useMediaQuery from "@mui/material/useMediaQuery";

import ArticleNav from "./ArticleNav";
import AppBarContent from "./Layout/AppBarContent";
import DrawerContent from "./Layout/DrawerContent";
import Footer from "./Layout/Footer";

import LayoutContext from "./LayoutContext";

import theme from "../theme";
import siteMetadata from "../data/metadata";

import scrollUtils from "../utils/scroll";
import storageUtils from "../utils/storage";
import { useScrollTop } from "../utils/scroll";

export const drawerWidth = 220;

const CustomAppBar = styled(AppBar, {
  shouldForwardProp: prop => prop !== "open",
})(({ theme, open, isdesktop }) => ({
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
    overflowY: "auto",
    height: "100vh",
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
  const [open, setOpen] = React.useState(storageUtils.load("drawer-open", "open") === "open");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const unsafeWindow = typeof window === "undefined" ? {} : window;
  unsafeWindow.setMobileOpen = setMobileOpen;

  const [title, setTitle] = React.useState(siteMetadata.title);
  const [pathname, setPathname] = React.useState("");
  const [scrollTop, setScrollTop] = useScrollTop();

  // 用于控制浮动按钮的弹出菜单
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleFloatingOpen = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleFloatingClose = () => {
    setAnchorEl(null);
  };

  const [navJson, setNavJson] = React.useState("");
  const [cachedNavJson, setCachedNavJson] = React.useState("");
  React.useEffect(() => {
    // 避免在页面切换的一瞬间使nav为空（从而无法出发动画）
    // 也为了避免在相同nav的页面之间切换时出现闪烁
    if (navJson) {
      setCachedNavJson(navJson);
    }
  }, [navJson]);

  const isDesktop = useMediaQuery(() => theme.breakpoints.up("md"));
  const toggleDrawer = () => {
    storageUtils.save("drawer-open", !open ? "open" : "close");
    setOpen(!open);
  };
  const toggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const isSSR = typeof window === "undefined";
  const container = isSSR ? undefined : window.document.body;

  // 用于挂载记录滚动进度钩子
  React.useEffect(() => {
    scrollUtils.registerGlobalListener();
  }, []);

  // 用于控制AppBar出现动画
  const [showAppBar, setShowAppBar] = React.useState(false);
  React.useEffect(() => {
    setShowAppBar(true);
  }, []);

  return (
    <LayoutContext.Provider value={{ setTitle, setNavJson, setPathname, scrollTop, setScrollTop }}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />

          <CSSTransition
            in={showAppBar}
            timeout={theme.transitions.duration.complex}
            classNames="appbar-float"
          >
            <div
              style={{
                position: "fixed",
                top: "-68px",
                left: "0px",
                width: "100%",
                zIndex: theme.zIndex.drawer + 1,
              }}
            >
              <CustomAppBar position="absolute" open={open} isdesktop={(!!isDesktop).toString()}>
                <Toolbar sx={{ pr: { sm: 2, lg: 4 } }}>
                  {/* Appbar 菜单按钮 */}
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={isDesktop ? toggleDrawer : toggleMobileDrawer}
                    sx={{ marginRight: { xs: "12px", md: "24px" } }}
                  >
                    <MenuIcon sx={{ display: { xs: "block", md: open ? "none" : "block" } }} />
                    <ChevronLeftIcon sx={{ display: { xs: "none", md: !open ? "none" : "block" } }} />
                  </IconButton>

                  <AppBarContent title={title} />
                </Toolbar>
              </CustomAppBar>
            </div>
          </CSSTransition>

          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={toggleMobileDrawer}
            ModalProps={{
              keepMounted: true, // 可以在移动设备上有更好的性能
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            <DrawerContent fold={false} pathname={pathname} />
          </Drawer>

          <PermanentDrawer
            anchor="left"
            variant="permanent"
            open={open}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <DrawerContent fold={!open} pathname={pathname} />
            <CSSTransition
              in={open && navJson}
              timeout={theme.transitions.duration.short}
              classNames="fade"
              unmountOnExit
            >
              <div>
                <Divider sx={{ mb: 1 }} />
                <ArticleNav navJson={cachedNavJson} pathname={pathname} />
              </div>
            </CSSTransition>
          </PermanentDrawer>

          <Box
            component="main"
            id="main"
            sx={{
              backgroundColor: theme =>
                theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />

            {/* 这里进入页面主体 */}
            {children}

            {/* 这里是页脚 */}
            <Footer />

            {/* 这里是浮动按钮 */}
            <NoSsr>
              <React.Fragment>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 32,
                    right: 32,
                  }}
                >
                  <Zoom
                    key="fab"
                    in={!open && !mobileOpen && !!navJson}
                    appear={true}
                    timeout={{
                      enter: theme.transitions.duration.short,
                      exit: theme.transitions.duration.short,
                    }}
                  >
                    <Fab color="primary" aria-label="list" onClick={handleFloatingOpen}>
                      <ListIcon />
                    </Fab>
                  </Zoom>
                </Box>

                <Backdrop
                  sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
                  open={Boolean(anchorEl)}
                  onClick={handleFloatingClose}
                />

                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleFloatingClose}
                  elevation={0}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        overflow: "visible",
                        background: "transparent",
                        paddingRight: "24px",
                        paddingBottom: "16px",
                      },
                    },
                  }}
                >
                  <Card
                    elevation={4}
                    sx={{
                      width: "min(300px, calc(100vw - 64px))",
                      padding: "12px 0",
                    }}
                  >
                    <ArticleNav
                      navJson={cachedNavJson}
                      pathname={pathname}
                      dense={false}
                      onClick={handleFloatingClose}
                    />
                  </Card>
                </Popover>
              </React.Fragment>
            </NoSsr>
          </Box>
        </Box>
      </ThemeProvider>
    </LayoutContext.Provider>
  );
};

export default Layout;
