import React, { useContext } from "react";
import { graphql } from "gatsby";
import Container from "@mui/material/Container";
import Seo from "../components/Seo";
import LayoutContext from "../components/LayoutContext";

const getTitle = () => "404: Not Found";

const NotFoundPage = ({ data }) => {
  const { title, setTitle } = useContext(LayoutContext);
  const siteTitle = data.site.siteMetadata.title;

  setTitle(getTitle());

  return (
    <Container maxWidth="sm">
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Container>
  );
};

export const Head = () => <Seo title={getTitle()} />;

export default NotFoundPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
