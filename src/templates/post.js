import React from "react";
import { graphql, Link as GatsbyLink } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Seo from "../components/Seo";
import Main from "../components/Main";
import Link from "../components/Link";
import Comments from "../components/Comments";
import CalendarAltIcon from "../components/Icon/CalendarAltIcon";
import LayerGroupIcon from "../components/Icon/LayerGroupIcon";
import TableOfContents from "../components/TableOfContents";

import { checkNegIndent } from "../utils/frontend";
import * as styles from "../style/article.module.less";

const getTitle = ({ data }) => {
  return data.post.frontmatter.title || "Untitled!";
};

const PostTemplate = ({ data, pageContext, location }) => {
  const { post } = data;
  const { navJson } = pageContext;
  const { slug, isDoc, cover, propsJson } = post.fields;
  const { date } = post.frontmatter;

  const coverImage = cover && getImage(cover);
  const props = propsJson && JSON.parse(propsJson);
  console.log(post.fields);
  const category = !isDoc && post.fields.category && JSON.parse(post.fields.category);
  console.log(category);

  // console.log("[nav]", navJson && JSON.parse(navJson));
  // console.log("[props]", props);

  return (
    <Main maxWidth="lg" title={getTitle({ data })} location={location} navJson={navJson}>
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

              <CardContent
                sx={{
                  p: { sm: 2, md: 3 },
                  paddingBottom: { sm: "8px !important", md: "16px !important" },
                }}
              >
                {isDoc ? (
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
                ) : (
                  <Typography
                    component="div"
                    className={styles.articleTitle + " " + styles.articleTitlePost}
                    sx={{ textIndent: checkNegIndent(post.frontmatter.title) ? "-0.32em" : 0 }}
                  >
                    {post.frontmatter.title}
                  </Typography>
                )}

                {(date || category) && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "grey.500",
                      mt: 1,
                      ml: 0.25,
                      mb: 4,
                      "& svg": { ml: 3, mr: 1 },
                      "& :first-child": { ml: 0 },
                    }}
                  >
                    {date && (
                      <>
                        <CalendarAltIcon fontSize="small" />
                        <Typography variant="body1" color="inherit" sx={{ wordSpacing: "-3px" }}>
                          {date}
                        </Typography>
                      </>
                    )}

                    {category && (
                      <>
                        <LayerGroupIcon fontSize="small" />
                        <Breadcrumbs
                          aria-label="breadcrumb"
                          sx={{ color: "inherit", "& .MuiBreadcrumbs-separator": { mx: 0.625 } }}
                        >
                          {category.map(({ name, to }, index) => (
                            <Link
                              component={GatsbyLink}
                              underline="hover"
                              color="inherit"
                              to={to}
                              key={index}
                            >
                              {name}
                            </Link>
                          ))}
                        </Breadcrumbs>
                      </>
                    )}
                  </Box>
                )}

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

                <Typography variant="body1" sx={{ mt: 4 }}>
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

            <Comments slug={slug} sx={{ mt: 2 }} />
          </Grid>

          {/* 这里是侧边栏 */}
          <Grid item xs={12} lg={3}>
            <Card
              sx={{
                position: "sticky",
                top: "98px",
              }}
            >
              <TableOfContents toc={post.tableOfContents} />
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
      tableOfContents(maxDepth: 3)
      frontmatter {
        title
        date(formatString: "YYYY 年 MM 月 DD 日")
        description
      }
      fields {
        cover {
          childImageSharp {
            gatsbyImageData
          }
        }
        slug
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
