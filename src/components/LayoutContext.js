import React from "react";

const LayoutContext = React.createContext({
  title: "",
  setTitle: () => {},
});

export default LayoutContext;
