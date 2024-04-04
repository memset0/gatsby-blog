import * as React from "react";
import Card from "@mui/material/Card";

import theme from "../theme";

const HoverableCard = React.forwardRef(props => {
  const { sx = {}, ...other } = props;
  return (
    <Card
      sx={{
        transition: "0.16s",
        "&:hover": {
          boxShadow: theme.shadows[4],
        },
        boxShadow: theme.shadows[1],
        ...sx,
      }}
      {...other}
    />
  );
});

export default HoverableCard;
