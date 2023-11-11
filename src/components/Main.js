import React, { useContext } from "react";
import { CSSTransition } from "react-transition-group";
import Container from "@mui/material/Container";
import LayoutContext from "../components/LayoutContext";

import siteMetadata from "../data/metadata";

const Main = ({ title, maxWidth, location, children }) => {
  const { setTitle } = useContext(LayoutContext);
  setTitle(title || siteMetadata.title);
  console.log(location);

  const [showMain, setShowMain] = React.useState(false);
  React.useEffect(() => {
    setShowMain(true);
  }, []);

  return (
    <CSSTransition in={showMain} timeout={200} classNames="fade">
      <div
        style={{
          opacity: "0",
        }}
      >
        <Container maxWidth={maxWidth || "lg"} sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </div>
    </CSSTransition>
  );
};

export default Main;
