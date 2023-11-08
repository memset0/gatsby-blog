import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f5f5f5",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © 2023 Your Website. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
