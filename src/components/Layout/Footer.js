import React from "react";
import { Link as GatsbyLink } from "gatsby";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import * as styles from "../../style/footer.module.less";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        // backgroundColor: "#f5f5f5",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        Proudly powered by{" "}
        <a href="https://gatsbyjs.org/" class={styles.footerLink} target="_blank">
          Gatsby.js
        </a>{" "}
        and themed by{" "}
        <a href="https://github.com/memset0/gatsby-blog" class={styles.footerLink} target="_blank">
          myself
        </a>
        . <br />
        Copyright © 2024{" "}
        <GatsbyLink component="a" to="/about/" className={styles.footerLink}>
          memset0
        </GatsbyLink>
        . All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
