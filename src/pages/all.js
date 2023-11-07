// src/pages/index.tsx
import React from "react";
import { graphql } from "gatsby";
// import Bio from "../components/Bio";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import ArticleList from "../components/Article/ArticleList";

const IndexPage = ({ data }) => (
  <Layout maxWidth="md">
    {/* <Bio /> */}
    <ArticleList posts={data.allMarkdownRemark.edges}></ArticleList>
  </Layout>
);

export const Head = () => <Seo title="主页" />;

export const query = graphql`
  query AllQuery {
    allMarkdownRemark(
      filter: { frontmatter: { publish: { eq: true } } }
      sort: { frontmatter: { date: DESC } }
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

export default IndexPage;
