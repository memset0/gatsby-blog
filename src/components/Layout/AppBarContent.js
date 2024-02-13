import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

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

    </>
  );
};

export default AppBarContent;
