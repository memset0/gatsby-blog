import React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";

import { parseTableOfContents } from "../utils/toc";
import { useScrollTop, customScrollTo } from "../utils/scroll";

function getElementOffset(element) {
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

  const scrollTop = useScrollTop();

  function gen(toc) {
    return (
      <List component="div" dense={true} disablePadding>
        {toc.map((el, index) => (
          <div key={index}>
            <ListItemButton onClick={() => scrollTo(el.href)}>
              <ListItemText sx={{ pl: `${el.level}em` }}>
                <span dangerouslySetInnerHTML={{ __html: el.text }}></span>
              </ListItemText>
            </ListItemButton>
            {el.children && (
              <Collapse in={true} timeout="auto" unmountOnExit>
                {gen(el.children)}
              </Collapse>
            )}
          </div>
        ))}
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
