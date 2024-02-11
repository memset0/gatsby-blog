import React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";

import { parseTableOfContents } from "../../utils/toc";

function gen(toc) {
  return (
    <List component="div" dense={true} sx={{ pt: 0, pb: 0 }}>
      {toc.map((el, index) => (
        <div key={index}>
          <ListItemButton component="a" href={el.href}>
            <ListItemText sx={{ textIndent: `${el.level}em` }}>
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
    <Box sx={{ mt: 2, mb: 2 }}>{gen(parsedToc)}</Box>
  ) : (
    <Typography variant="body1" sx={{ m: 2 }}>
      TOC Load Failed!
    </Typography>
  );
};

export default TableOfContents;
