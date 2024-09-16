import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#AD76B5",
      // main: "#B481BB",
    },
    secondary: {
      main: "#77428D",
    },
    error: {
      main: red.A400,
    },
  },

  typography: {
    // inspired by Fonts.css
    fontFamily: [
      "-apple-system",
      '"Noto Sans"',
      '"Helvetica Neue"',
      "Helvetica",
      '"Nimbus Sans L"',
      "Arial",
      '"Liberation Sans"',
      '"PingFang SC"',
      // '"Hiragino Sans GB"',
      '"Noto Sans CJK SC"',
      '"Source Han Sans SC"',
      '"Source Han Sans CN"',
      '"Microsoft YaHei"',
      '"Wenquanyi Micro Hei"',
      '"WenQuanYi Zen Hei"',
      '"ST Heiti"',
      "SimHei",
      '"WenQuanYi Zen Hei Sharp"',
      "sans-serif",
    ].join(","),
  },

  // constant: {
  //   test: '123',
  // },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
