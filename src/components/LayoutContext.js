import React from "react";

const LayoutContext = React.createContext({
  setTitle: () => {},
  setNavJson: () => {},
  setPathname: () => {},
});

export default LayoutContext;
