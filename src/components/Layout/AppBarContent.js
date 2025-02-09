import React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import ViewSourceIcon from "../Icon/ViewSourceIcon";
import Search from "../Search";

import siteMetadata from "../../data/metadata";
import { checkNegIndent } from "../../utils/frontend";

export const AppBarIconButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  width: "2.5rem",
  height: "2.5rem",
}));

const AppBarContent = ({ title, isDesktop }) => {
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
          mr: 2,
        }}
      >
        {title ? title : siteMetadata.title}
      </Typography>

      {/* 搜索框 */}
      <Search isDesktop={isDesktop} />

      {/* Github 仓库链接 */}
      <AppBarIconButton href="https://github.com/memset0/gatsby-blog" target="_blank">
        <ViewSourceIcon sx={{ fill: "white", fontSize: "1.5rem" }} />
      </AppBarIconButton>
    </>
  );
};

export default AppBarContent;
