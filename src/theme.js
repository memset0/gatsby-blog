import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#B481BB",
    },
    secondary: {
      main: "#77428D",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
