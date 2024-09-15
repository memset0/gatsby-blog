import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import { Link as GatsbyLink } from "gatsby";

import siteMetadata from "../../data/metadata";
import theme from "../../theme";
import navigators from "../../data/navigators";

const DrawerContent = ({ fold, pathname }) => {
  return (
    <>
      <Toolbar
        sx={{
          // color: "white",
          // background: theme.palette.secondary.main,
          color: theme.palette.secondary.main,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [0],
        }}
      >
        <Button
          component={GatsbyLink}
          to="/"
          sx={{
            py: [1.5],
            width: "100%",
            borderRadius: "0",
            opacity: fold ? 0 : 1,
          }}
        >
          <Avatar
            sx={{
              display: "inline-block",
              "& img": {
                transition: ["0.5s"],
                "&:hover": {
                  transform: ["rotate(360deg)"],
                },
              },
            }}
          >
            <StaticImage src="../../images/avatar.png" alt={siteMetadata.author.name} />
          </Avatar>
          {/* <Box sx={{ ml: 2, display: "inline-block", fontWeight: "bold" }}>mem 的小站</Box> */}
        </Button>
      </Toolbar>
      <Divider sx={{ opacity: { xs: 0, md: fold ? 0 : 1 }, transition: "opacity 0.2s" }} />
      <List component="nav">
        {navigators.map((navigator, index) => (
          <ListItem disablePadding key={index}>
            <ListItemButton
              to={navigator.to}
              selected={navigator.rule(pathname)}
              className={navigator.rule(pathname) ? "selected" : ""}
              component={GatsbyLink}
              sx={{
                pl: fold ? 2 : 4.75,
                transition: "padding 0.2s",
                "&.selected": {
                  color: theme.palette.secondary.main,
                  "& svg": { fill: theme.palette.secondary.main },
                },
              }}
            >
              <ListItemIcon>{navigator.icon}</ListItemIcon>
              <ListItemText sx={{ pl: 1 }} primary={navigator.text} />
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
