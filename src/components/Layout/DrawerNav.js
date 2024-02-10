import React from "react";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link as GatsbyLink } from "gatsby";

function generateNav(nav, level) {
  // console.log("[nav] generate", nav);
  return (
    <List component="div">
      {nav.map((el, index) => {
        const Text = <ListItemText sx={{ ml: level * 4 }}>{el.title}</ListItemText>;

        if (el.children) {
          const [open, setOpen] = React.useState(true);
          const handleClick = () => setOpen(!open);
          return (
            <>
              <ListItemButton key={index} onClick={handleClick}>
                {Text}
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                {generateNav(el.children, level + 1)}
              </Collapse>
            </>
          );
        } else {
          return (
            <ListItemButton key={index} component={GatsbyLink} to={el.slug}>
              {Text}
            </ListItemButton>
          );
        }
      })}
    </List>
  );
}

const DrawerNav = ({ navJson }) => {
  const nav = JSON.parse(navJson);
  // console.log("[nav] reload with ", nav);

  return (
    <>
      <Divider sx={{ opacity: { xs: 0, md: 1 } }} />
      {generateNav(nav, 0)}
    </>
  );
};

export default DrawerNav;
