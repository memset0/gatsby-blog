import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { Link as GatsbyLink } from "gatsby";
import Link from "../Link";
// import LogoSvg from "../../images/logo.svg";

const DrawerContent = () => {
  // const isRouteMatched = route => {
  //   // return route != "/" && location.pathname.startsWith(router);
  // };

  const navigators = [
    {
      to: "/",
      text: "主页",
      icon: <HomeIcon />,
    },
    {
      to: "/oi/",
      text: "算法竞赛",
      icon: <LeaderboardIcon />,
    },
    {
      to: "/about/",
      text: "关于我",
      icon: <PersonIcon />,
    },
  ];

  return (
    <>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <Link to="/" sx={{ width: "100%", textAlign: "center" }}>
          <img height="52" src="/logo.svg" loading="eager" alt="" />
        </Link>
      </Toolbar>
      <Divider sx={{ opacity: { xs: 0, md: 1 } }} />
      <List component="nav">
        {navigators.map(navigator => (
          <ListItem disablePadding>
            <ListItemButton to={navigator.to} component={GatsbyLink}>
              <ListItemIcon>{navigator.icon}</ListItemIcon>
              <ListItemText primary={navigator.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItemButton>
        </ListItem> */}
      </List>
    </>
  );
};

export default DrawerContent;
