import React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";

import { parseTableOfContents } from "../utils/toc";

function gen(toc) {
  return (
    <List component="div" dense={true} disablePadding>
      {toc.map((el, index) => (
        <div key={index}>
          <ListItemButton component="a" href={el.href}>
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

const TableOfContents = ({ toc }) => {
  let parsedToc = null;
  try {
    parsedToc = parseTableOfContents(toc);
  } catch (e) {
    console.error("[toc]", e);
  }

  return parsedToc ? (
    <Box sx={{ my: 1.5 }}>
      <Typography
        variant="body2"
        fontWeight="bold"
        color="grey.600"
        sx={{ mt: 2, px: 2, py: 0.5, letterSpacing: "-0.2px" }}
      >
        TABLE OF CONTENTS
      </Typography>
      {gen(parsedToc)}
    </Box>
  ) : (
    <Typography variant="body1" sx={{ m: 2 }}>
      TOC Load Failed!
    </Typography>
  );
};

export default TableOfContents;
