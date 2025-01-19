import React from "react";
import Box from "@mui/material/Box";

const MetadataItem = ({ icon, children, size = "1.5rem" }) => {
  return (
    <Box
      sx={{
        mr: 2,
        display: "inline-flex",
        alignItems: "center",
        height: size,
        lineHeight: size,
        "& svg": { display: "inline-block", height: size, lineHeight: size },
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: size,
          textAlign: "center",
          height: size,
          marginRight: `calc(${size} * 0.15)`,
        }}
      >
        {icon}
      </span>
      {children}
    </Box>
  );
};

export default MetadataItem;
