import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"

const Layout = ({ children }) => (
  <div>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">My Blog</Typography>
      </Toolbar>
    </AppBar>
    <main>{children}</main>
    <footer>
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()}, My Blog
      </Typography>
    </footer>
  </div>
)

export default Layout
