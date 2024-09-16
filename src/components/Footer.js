import React from "react";
import { Link as GatsbyLink } from "gatsby";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        padding: "20px",
        textAlign: "center",
        "& .footer-link": {
          color: "inherit",
          textDecoration: "none",
          transition: "opacity 0.2s ease",
          "&:hover": {
            opacity: "0.5",
          },
        },
      }}
    >
      <Typography variant="body2" color="textSecondary">
        Proudly powered by{" "}
        <a href="https://gatsbyjs.org/" class="footer-link" target="_blank" rel="noreferrer">
          Gatsby.js
        </a>{" "}
        and themed by{" "}
        <a href="https://github.com/memset0/gatsby-blog" class="footer-link" target="_blank" rel="noreferrer">
          myself
        </a>
        . <br />
        Copyright © 2024{" "}
        <GatsbyLink component="a" to="/about/" className="footer-link">
          memset0
        </GatsbyLink>
        . All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
