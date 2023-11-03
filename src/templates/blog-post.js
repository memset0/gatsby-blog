import * as React from "react";
import { Link, graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import EventIcon from "@mui/icons-material/Event";
import CategoryIcon from "@mui/icons-material/Category";

import Layout from "../components/Layout";
import Seo from "../components/Seo";

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  let coverImage = null;
  if (post.fields.hasCover) {
    coverImage = getImage(post.fields.cover);
  }

  return (
    <Layout location={location} title={post.frontmatter.title || "Untitled"}>
      <article itemScope itemType="http://schema.org/Article">
        <Grid container spacing={2}>
          {/* 这里是博文 */}
          <Grid item xs={12} lg={9}>
            <Card>
              {post.fields.hasCover && (
                <CardMedia component="div">
                  <GatsbyImage
                    image={coverImage}
                    alt={post.frontmatter.title}
                  />
                </CardMedia>
              )}
              <CardContent sx={{ padding: { md: 3 } }}>
                <Typography variant="h5" component="div">
                  {post.frontmatter.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "grey.500",
                    mt: 1,
                    mb: 2,
                  }}
                >
                  <EventIcon sx={{ mr: 1 }} />
                  <Typography variant="body2" color="inherit">
                    {post.frontmatter.date}
                  </Typography>
                  <CategoryIcon sx={{ mx: 1 }} />
                  <Typography variant="body2" color="inherit">
                    {"category"}
                  </Typography>
                </Box>
                <Typography variant="body1">
                  <section
                    dangerouslySetInnerHTML={{ __html: post.html }}
                    itemProp="articleBody"
                  />
                </Typography>
              </CardContent>
            </Card>

            {/* 这里放前后博文的导航链接 */}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {previous && (
                <Grid item xs={12} lg={6}>
                  <Card>
                    <CardContent>
                      <Link to={previous.fields.slug} rel="prev">
                        ← {previous.frontmatter.title}
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              {next && (
                <Grid item xs={12} lg={6}>
                  <Card>
                    <CardContent>
                      <Link to={next.fields.slug} rel="next">
                        {next.frontmatter.title} →
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* 这里是侧边栏 */}
          <Grid item xs={12} lg={3}>
            <Card>
              <CardContent>
                <p>这里打算做 Sidebar</p>
                <p>这里打算做 Sidebar</p>
                <p>这里打算做 Sidebar</p>
                <p>这里打算做 Sidebar</p>
                <p>这里打算做 Sidebar</p>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </article>
    </Layout>
  );
};

export const Head = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
      fields {
        cover {
          childImageSharp {
            gatsbyImageData
          }
        }
        hasCover
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
