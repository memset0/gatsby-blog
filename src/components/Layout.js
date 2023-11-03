import React from "react";
import { Link as GatsbyLink } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { styled, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import useMediaQuery from "@mui/material/useMediaQuery";
import DrawerContent from "./Layout/DrawerContent";

import theme from "../theme";
import siteMetadata from "../data/metadata";

export const drawerWidth = 240;

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
    width: isdesktop ? `calc(100% - ${drawerWidth}px)` : "100%",
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

const Layout = ({ children, title, maxWidth }) => {
  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleAnchorElClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleAnchorElClose = () => {
    setAnchorEl(null);
  };

  const isDesktop = useMediaQuery(() => theme.breakpoints.up("md"));

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const toggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    typeof window !== "undefined" ? () => window.document.body : undefined;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} isdesktop={isDesktop}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            {/* Appbar 菜单按钮 */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={isDesktop ? toggleDrawer : toggleMobileDrawer}
              sx={{
                marginRight: "36px",
              }}
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

            {/* Appbar 标题 */}
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {title ? title : siteMetadata.title}
            </Typography>

            {/* Appbar 右侧 */}
            <IconButton onClick={handleAnchorElClick}>
              <Avatar>
                <StaticImage
                  src="../images/avatar.png"
                  alt={siteMetadata.author.name}
                />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleAnchorElClose}
            >
              <MenuItem
                onClick={handleAnchorElClose}
                component={GatsbyLink}
                href={siteMetadata.socialLink.github}
                target="_blank"
              >
                <ListItemIcon>
                  <GitHubIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Github</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={handleAnchorElClose}
                component={GatsbyLink}
                href={siteMetadata.socialLink.codeforces}
                target="_blank"
              >
                <ListItemIcon>
                  <LeaderboardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Codeforces</ListItemText>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

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
          <Container
            maxWidth={maxWidth ? maxWidth : "lg"}
            sx={{ mt: 6, mb: 6 }}
          >
            {children}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
