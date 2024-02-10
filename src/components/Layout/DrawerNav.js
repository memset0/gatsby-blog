import React from "react";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link as GatsbyLink } from "gatsby";

function generateNav(nav, level, pathname) {
  // console.log("[nav] generate", { nav, level, pathname });
  return (
    <List component="div" dense={true}>
      {nav.map((el, index) => {
        const correct = pathname === el.slug;
        const Text = (
          <ListItemText
            disableTypography={true}
            sx={{ ml: level * 4, fontWeight: correct ? "bold" : "inherit" }}
          >
            {el.title}
          </ListItemText>
        );

        if (el.children) {
          return (
            <div key={index}>
              <ListItemButton>
                {Text}
              </ListItemButton>
              <Collapse in={true} timeout="auto" unmountOnExit>
                {generateNav(el.children, level + 1, pathname)}
              </Collapse>
            </div>
          );
        } else {
          return (
            <div key={index}>
              {
                <ListItemButton key={index} component={GatsbyLink} to={el.slug}>
                  {Text}
                </ListItemButton>
              }
            </div>
          );
        }
      })}
    </List>
  );
}

const DrawerNav = ({ navJson, pathname }) => {
  const nav = JSON.parse(navJson);
  // console.log("[nav] reload with ", nav, pathname);
  if (pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  return (
    <>
      <Divider sx={{ opacity: { xs: 0, md: 1 } }} />
      {generateNav(nav, 0, pathname)}
    </>
  );
};

export default DrawerNav;
