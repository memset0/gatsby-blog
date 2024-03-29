import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

const GlassesIcon = props => {
  const { sx = {}, ...other } = props;

  return (
    <SvgIcon sx={{ fill: "currentColor", ...sx }} {...other}>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22,13h0v5a2,2,0,0,1-2,2H15a2,2,0,0,1-2-2V17H11v1a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V13H2a1,1,0,0,1,.083-.406l4-8A1,1,0,0,1,7,4H9A1,1,0,0,1,9,6H7.65L4.094,13H10a1,1,0,0,1,1,1v1h2V14a1,1,0,0,1,1-1h5.906L16.35,6H15a1,1,0,0,1,0-2h2a1,1,0,0,1,.914.594l4,8A1,1,0,0,1,22,13Z" />
      </svg>
    </SvgIcon>
  );
};

export default GlassesIcon;
