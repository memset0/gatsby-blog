import React from "react";

const LayoutContext = React.createContext({
  setTitle: () => {},
  setNavJson: () => {},
  setPathname: () => { },
  
  scrollTop: 0,
  // setScrollTop: () => {},
});

export default LayoutContext;
