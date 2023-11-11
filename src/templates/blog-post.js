import React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import EventIcon from "@mui/icons-material/Event";
import CategoryIcon from "@mui/icons-material/Category";
import Link from "../components/Link";
import Main from "../components/Main";
import Seo from "../components/Seo";

import { isNegativeIndentTitleRequired } from "../utils/frontend";

const getTitle = ({ data }) => {
  return data.post.frontmatter.title || "Untitled!";
};

const BlogPostTemplate = ({ data, location }) => {
  const { post } = data;

  let coverImage = null;
  if (post.fields.hasCover) {
    coverImage = getImage(post.fields.cover);
  }

  return (
    <Main maxWidth="lg" title={getTitle({ data })} location={location}>
      <article itemScope itemType="http://schema.org/Article">
        <Grid container spacing={2}>
          {/* 这里是博文 */}
          <Grid item xs={12} lg={9}>
            <Card className="post-card">
              {post.fields.hasCover && (
                <CardMedia component="div">
                  <GatsbyImage
                    style={{ width: "100%", maxHeight: "24rem" }}
                    image={coverImage}
                    imgStyle={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    alt={post.frontmatter.title}
                  />
                </CardMedia>
              )}

              <CardContent sx={{ padding: { md: 3 } }}>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    mt: 0.5,
                    textIndent: isNegativeIndentTitleRequired(
                      post.frontmatter.title
                    )
                      ? "-0.75rem"
                      : 0,
                    fontSize: { lg: "1.6rem" },
                  }}
                >
                  {post.frontmatter.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "grey.500",
                    mt: 1.5,
                    mb: 4,
                  }}
                >
                  <EventIcon sx={{ mr: 1 }} />
                  <Typography variant="body1" color="inherit">
                    {post.frontmatter.date}
                  </Typography>

                  <CategoryIcon sx={{ ml: 2, mr: 1 }} />
                  <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{ color: "grey.500" }}
                  >
                    {JSON.parse(post.fields.category).map(
                      ({ name, to }, index) => (
                        <Link
                          underline="hover"
                          color="inherit"
                          href={to}
                          key={index}
                        >
                          {name}
                        </Link>
                      )
                    )}
                  </Breadcrumbs>
                </Box>

                <Typography variant="body1">
                  <section
                    className="typography"
                    itemProp="articleBody"
                    dangerouslySetInnerHTML={{ __html: post.html }}
                  />
                </Typography>
              </CardContent>
            </Card>

            {/* 这里放前后博文的导航链接 */}
            {/* <Grid container spacing={2} sx={{ mt: 1 }}>
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
            </Grid> */}
          </Grid>

          {/* 这里是侧边栏 */}
          <Grid item xs={12} lg={3}>
            <Card>
              <CardContent>
                <p>这里是还没做好的侧边栏</p>
                <p>这里是还没做好的侧边栏</p>
                <p>这里是还没做好的侧边栏</p>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </article>
    </Main>
  );
};

export const Head = ({ data }) => {
  return (
    <Seo
      title={getTitle({ data })}
      description={data.post.frontmatter.description || data.post.excerpt}
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
    post: markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MM/DD/YYYY")
        description
      }
      fields {
        cover {
          childImageSharp {
            gatsbyImageData
          }
        }
        hasCover
        category
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
