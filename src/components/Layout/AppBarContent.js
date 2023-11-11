import React from "react";
import { Link as GatsbyLink } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GitHubIcon from "@mui/icons-material/GitHub";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

import siteMetadata from "../../data/metadata";
import { isNegativeIndentTitleRequired } from "../../utils/frontend";

const AppBarContent = ({ title }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleAnchorElClick = event => setAnchorEl(event.currentTarget);
  const handleAnchorElClose = () => setAnchorEl(null);

  return (
    <div>
      {/* Appbar 标题 */}
      <Typography
        component="h1"
        variant="h6"
        color="inherit"
        noWrap
        sx={{
          flexGrow: 1,
          textIndent:
            title && isNegativeIndentTitleRequired(title) ? "-0.5em" : "0",
        }}
      >
        {title ? title : siteMetadata.title}
      </Typography>

      {/* Appbar 右侧 */}
      <IconButton onClick={handleAnchorElClick}>
        <Avatar>
          <StaticImage
            src="../images/avatar.png"
            alt={siteMetadata.author.name}
          />
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleAnchorElClose}
      >
        <MenuItem
          onClick={handleAnchorElClose}
          component={GatsbyLink}
          href={siteMetadata.socialLink.github}
          target="_blank"
        >
          <ListItemIcon>
            <GitHubIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Github</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleAnchorElClose}
          component={GatsbyLink}
          href={siteMetadata.socialLink.codeforces}
          target="_blank"
        >
          <ListItemIcon>
            <LeaderboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Codeforces</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AppBarContent;
