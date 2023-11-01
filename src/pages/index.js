// src/pages/index.tsx
import React from "react";
import { graphql, Link } from "gatsby";
import Seo from "../components/Seo";
import Layout from "../components/Layout";

const IndexPage = ({ data }) => (
  <Layout>
    {data.allMarkdownRemark.edges.map(post => (
      <div key={post.node.id}>
        <h2>{post.node.frontmatter.title}</h2>
        <p>Posted on {post.node.frontmatter.date}</p>
        <Link to={post.node.fields.slug}>Read More</Link>
      </div>
    ))}
  </Layout>
);

export const Head = () => <Seo title="主页" />;

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;

export default IndexPage;
