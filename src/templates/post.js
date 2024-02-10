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

import { checkNegIndent } from "../utils/frontend";
import * as styles from "../style/article.module.less";

const getTitle = ({ data }) => {
  return data.post.frontmatter.title || "Untitled!";
};

const PostTemplate = ({ data, pageContext, location }) => {
  const { post } = data;
  const { navJson } = pageContext;
  const { isDoc, cover, propsJson } = post.fields;

  const coverImage = cover && getImage(cover);
  const props = propsJson && JSON.parse(propsJson);
  console.log("[nav]", navJson && JSON.parse(navJson));
  console.log("[props]", props);

  return (
    <Main maxWidth="lg" title={getTitle({ data })} location={location}>
      <article itemScope itemType="http://schema.org/Article">
        <Grid container spacing={2}>
          {/* 这里是博文 */}
          <Grid item xs={12} lg={9}>
            <Card className={styles.articleCard}>
              {coverImage && (
                <CardMedia component="div">
                  <GatsbyImage
                    style={{ width: "100%", maxHeight: "24rem" }}
                    image={coverImage}
                    imgStyle={{ objectFit: "cover", objectPosition: "center" }}
                    alt={post.frontmatter.title}
                  />
                </CardMedia>
              )}

              <CardContent sx={{ padding: { md: 3 } }}>
                {isDoc ? (
                  <>
                    <Typography
                      component="div"
                      className={styles.articleTitle + " " + styles.articleTitleDoc}
                      sx={{
                        textIndent: checkNegIndent(post.frontmatter.title) ? "-0.32em" : 0,
                        mt: 2,
                      }}
                    >
                      {post.frontmatter.title}
                    </Typography>

                    {props && (
                      <Box sx={{ mt: 2, ml: 4 }}>
                        {props.map((el, index) => (
                          <Typography
                            variant="body1"
                            component="div"
                            key={index}
                            sx={{ lineHeight: "1.8", color: "grey" }}
                          >
                            <div style={{ width: "9.8em", display: "inline-block" }}>{el.key}</div>
                            {el.value}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    <Typography
                      component="div"
                      className={styles.articleTitle + " " + styles.articleTitlePost}
                      sx={{ textIndent: checkNegIndent(post.frontmatter.title) ? "-0.32em" : 0 }}
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
                      <Breadcrumbs aria-label="breadcrumb" sx={{ color: "grey.500" }}>
                        {JSON.parse(post.fields.category).map(({ name, to }, index) => (
                          <Link underline="hover" color="inherit" href={to} key={index}>
                            {name}
                          </Link>
                        ))}
                      </Breadcrumbs>
                    </Box>
                  </>
                )}

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
    <Seo title={getTitle({ data })} description={data.post.frontmatter.description || data.post.excerpt} />
  );
};

export default PostTemplate;

export const pageQuery = graphql`
  query PostTemplate($id: String!, $previousPostId: String, $nextPostId: String) {
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
        isDoc
        category
        propsJson
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
