import React from "react";

const LayoutContext = React.createContext({
  setTitle: () => {},
  setNavJson: () => {},
});

export default LayoutContext;
