import React from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ViewSourceIcon from "../Icon/ViewSourceIcon";

import siteMetadata from "../../data/metadata";
import { checkNegIndent } from "../../utils/frontend";

const AppBarContent = ({ title }) => {
  return (
    <>
      {/* Appbar 标题 */}
      <Typography
        component="h1"
        variant="h6"
        color="inherit"
        noWrap
        sx={{
          flexGrow: 1,
          textIndent: title && checkNegIndent(title) ? "-0.5em" : "0",
        }}
      >
        {title ? title : siteMetadata.title}
      </Typography>

      {/* Appbar 右侧 */}
      <IconButton href="https://github.com/memset0/gatsby-blog" target="_blank">
        <ViewSourceIcon sx={{ fill: "white" }} />
      </IconButton>
    </>
  );
};

export default AppBarContent;
