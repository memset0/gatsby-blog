import React from "react";
import { Link as GatsbyLink, graphql } from "gatsby";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArticleList from "../components/ArticleList";
import Main from "../components/Main";
import Seo from "../components/Seo";

import siteMetadata from "../data/metadata";

const getTitle = ({ data, pageContext }) => {
  const names = JSON.parse(pageContext.names);
  if (names.length) {
    return "文章列表：" + names.join(" / ");
  } else {
    return siteMetadata.title;
  }
};

const PostListTemplate = ({ data, location, pageContext }) => {
  const { pathPrefix, pageNumber, numberOfPages } = pageContext;

  const getTarget = page => (page === 1 ? pathPrefix : `${pathPrefix}${page}`);

  return (
    <Main maxWidth="md" title={getTitle({ data, pageContext })} location={location}>
      <ArticleList posts={data.posts.edges} sx={{ marginLeft: "auto", marginRight: "auto" }}></ArticleList>

      {numberOfPages > 1 && (
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pagination
            page={pageNumber + 1}
            count={numberOfPages}
            color="primary"
            variant="outlined"
            shape="rounded"
            renderItem={item => <PaginationItem component={GatsbyLink} to={getTarget(item.page)} {...item} />}
          />
        </Box>
      )}
    </Main>
  );
};

export default PostListTemplate;

export const Head = ({ data, pageContext }) => <Seo title={getTitle({ data, pageContext })} />;

export const pageQuery = graphql`
  query PostListTemplate($skip: Int!, $limit: Int!, $prefixRegex: String!) {
    posts: allMarkdownRemark(
      filter: { frontmatter: { publish: { eq: true } }, fields: { slug: { regex: $prefixRegex } } }
      sort: { frontmatter: { date: DESC } }
      skip: $skip
      limit: $limit
    ) {
      edges {
        node {
          id
          excerptAst
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
          fields {
            slug
            cover {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
      }
    }
  }
`;
