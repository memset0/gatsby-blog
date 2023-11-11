import React from "react";
import { graphql } from "gatsby";
import Main from "../components/Main";
import Seo from "../components/Seo";

const getTitle = () => "404: Not Found";

const NotFoundPage = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Main maxWidth="sm" title={getTitle()}>
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Main>
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
