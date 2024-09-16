import React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link as GatsbyLink } from "gatsby";

import theme from "../theme";

const ArticleNav = ({ navJson, pathname, dense = true, onClick = () => {} }) => {
  if (!navJson) {
    return <></>;
  }

  function generateNav(nav, level, pathname) {
    // console.log("[nav] generate", { nav, level, pathname });
    return (
      <List component="div" dense={dense} disablePadding>
        {nav.map((el, index) => {
          const Text = (
            <ListItemText
              disableTypography={true}
              sx={{
                ml: level * 3,
                color: pathname === el.slug ? theme.palette.secondary.main : "inherit",
                fontWeight: "inherit",
                whiteSpace: "normal",
              }}
              onClick={onClick}
            >
              {el.title}
            </ListItemText>
          );

          if (el.children) {
            return (
              <div key={index}>
                <ListItemButton disabled sx={{ opacity: "1 !important", fontWeight: "bold" }}>
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
                  <ListItemButton key={index} component={GatsbyLink} to={el.slug} onClick={onClick}>
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

  const nav = JSON.parse(navJson);
  // console.log("[nav] reload with ", nav, pathname);
  if (pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  return (
    <>
      <Box sx={{ fontSize: "0.9em", "& .MuiListItemText-root": { my: 0.25 } }}>
        {generateNav(nav, 0, pathname)}
      </Box>
    </>
  );
};

export default ArticleNav;
