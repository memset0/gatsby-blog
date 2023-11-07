import React from "react";
import { graphql } from "gatsby";
import Seo from "../components/Seo";
import Link from "../components/Link";
import Layout from "../components/Layout";
import ArticleList from "../components/Article/ArticleList";

const BlogListTemplate = ({ data, pageContext }) => {
  const { pathPrefix, previousPagePath, nextPagePath } = pageContext;

  return (
    <Layout maxWidth="md">
      <div>{JSON.stringify(pathPrefix)}</div>
      <div>
        {previousPagePath ? <Link to={previousPagePath}>Previous</Link> : null}
        {nextPagePath ? <Link to={nextPagePath}>Next</Link> : null}
      </div>
      <ArticleList posts={data.posts.edges}></ArticleList>
    </Layout>
  );
};

export default BlogListTemplate;

export const Head = () => <Seo title="主页" />;

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
