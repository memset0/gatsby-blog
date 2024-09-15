import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import LayoutContext from "../components/LayoutContext";

import { parseTableOfContents } from "../utils/toc";
import { customScrollTo } from "../utils/scroll";

function getElementOffset(element) {
  if (!element) {
    return 0;
  }
  return element.offsetTop;
}

function scrollTo(href) {
  const id = href.slice(1);
  const element = document.getElementById(id);
  console.log("[toc] scroll to", href, id, element, element.scrollTop);
  if (element) {
    customScrollTo(getElementOffset(element) - 80, true);
  }
}

const TableOfContents = ({ toc }) => {
  let parsedToc = null;
  try {
    parsedToc = parseTableOfContents(toc);
  } catch (e) {
    console.error("[toc]", e);
  }

  // const { scrollTop } = useContext(LayoutContext);

  function gen(toc) {
    return (
      <List component="div" dense={true} disablePadding>
        {toc.map((item, index) => {
          // const $heading = document.getElementById(item.href.slice(1));
          // console.log("[toc]", item, $heading, getElementOffset($heading));

          return (
            <div key={index}>
              <ListItemButton onClick={() => scrollTo(item.href)} sx={{ px: 1, py: 0.25 }}>
                <ListItemText
                  sx={{
                    pl: item.level * 2 + 1,
                    "& .MuiListItemText-primary": {
                      width: "100%",
                      display: "block",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    },
                  }}
                >
                  {item.text.replace(/&#x26;/g, "&")}
                </ListItemText>
              </ListItemButton>
              {item.children && (
                <Collapse in={true} timeout="auto" unmountOnExit>
                  {gen(item.children)}
                </Collapse>
              )}
            </div>
          );
        })}
      </List>
    );
  }

  return parsedToc ? (
    <Box
      sx={{
        my: 1.5,
        maxHeight: "calc(100vh - 140px)",
        overflowY: "auto",
      }}
    >
      <Typography
        variant="body2"
        fontWeight="bold"
        color="grey.500"
        sx={{
          mt: 0.5,
          px: 2,
          py: 0.5,
          letterSpacing: "-0.2px",
        }}
      >
        TABLE OF CONTENTS
      </Typography>
      {gen(parsedToc)}
    </Box>
  ) : (
    <Typography variant="body2" sx={{ m: 2 }}>
      <p>加载失败...</p>
    </Typography>
  );
};

export default TableOfContents;
