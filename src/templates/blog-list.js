import React from "react";
import { Link as GatsbyLink, graphql } from "gatsby";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArticleList from "../components/Article/ArticleList";
import Main from "../components/Main";
import Seo from "../components/Seo";

const getTitle = ({ data, pageContext }) => {
  return "文章列表";
};

const BlogListTemplate = ({ data, pageContext }) => {
  const { pathPrefix, pageNumber, numberOfPages } = pageContext;

  const getTarget = page => (page === 1 ? pathPrefix : `${pathPrefix}${page}`);

  return (
    <Main maxWidth="md" title={getTitle({ data, pageContext })}>
      <ArticleList
        posts={data.posts.edges}
        sx={{ marginLeft: "auto", marginRight: "auto" }}
      ></ArticleList>

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
            renderItem={item => (
              <PaginationItem
                component={GatsbyLink}
                to={getTarget(item.page)}
                {...item}
              />
            )}
          />
        </Box>
      )}
    </Main>
  );
};

export default BlogListTemplate;

export const Head = ({ data, pageContext }) => (
  <Seo title={getTitle({ data, pageContext })} />
);

export const pageQuery = graphql`
  query IndexQuery($skip: Int!, $limit: Int!, $prefixRegex: String!) {
    posts: allMarkdownRemark(
      filter: {
        frontmatter: { publish: { eq: true } }
        fields: { slug: { regex: $prefixRegex } }
      }
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
