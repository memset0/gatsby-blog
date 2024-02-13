import React from "react";
import { graphql } from "gatsby";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Main from "../components/Main";
import Seo from "../components/Seo";

const getTitle = () => "404: Not Found";

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;
  // console.log("[404]", siteTitle);
  
  return (
    <Main maxWidth="md" title={getTitle()} location={location}>
      <Card sx={{ mt: 1 }}>
        <CardContent sx={{ pl: 3, pr: 3 }}>
          <Typography variant="h3" sx={{ mt: 4, mb: 2 }}>
            404: Not Found
          </Typography>
          <Typography variant="body1">
            <p>非常抱歉，你访问的页面并不存在……</p>
            <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
          </Typography>
        </CardContent>
      </Card>
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
