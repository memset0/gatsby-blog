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
  const cssclasses = post.fields.cssclasses || [];

  const authors = post.fields.authors || []; // 作者信息（常用于有多位作者的场景）
  const createTime = post.fields.createTime;
  const updateTime = post.fields.updateTime;
  const category = post.fields.category && JSON.parse(post.fields.category);

  const coverImage = !isDoc && cover && getImage(cover);
  const props = propsJson && JSON.parse(propsJson);

  // console.log("[nav]", navJson && JSON.parse(navJson));
  // console.log("[props]", props);

  return (
    <Main maxWidth="lg" title={getTitle({ data })} location={location} navJson={navJson}>
      <article itemScope itemType="http://schema.org/Article">
        <Grid container spacing={2}>
          {/* 这里是博文 */}
          <Grid item xs={12} lg={9}>
            <Card className={styles.articleCard} sx={{ pt: coverImage ? 0 : 2 }}>
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
                <Typography
                  component="div"
                  className={
                    styles.articleTitle + " " + (isDoc ? styles.articleTitleDoc : styles.articleTitlePost)
                  }
                  sx={{
                    color: "#202020",
                    fontWeight: "600",
                    letterSpacing: "0.02938em !important",
                    px: 0.25,
                    textIndent: checkNegIndent(post.frontmatter.title) ? "-0.5em" : 0,
                  }}
                >
                  {post.frontmatter.title}
                </Typography>

                {(createTime || authors.length) && (
                  <Box
                    sx={{
                      // display: "flex",
                      // alignItems: "center",
                      color: "grey.500",
                      mx: 0.25,
                      mt: isDoc ? 1.5 : 1,
                      mb: 2.75,
                      "& div": { ml: 2, display: "inline-flex", alignItems: "center" },
                      "& div:first-child": { ml: 0 },
                      "& svg": { mr: 0.75, fontSize: "1.2em", display: "inline-block" },
                    }}
                  >
                    {createTime && (
                      <div>
                        <CalendarAltIcon />
                        <Typography variant="body1" color="inherit" sx={{ wordSpacing: "-1px" }}>
                          {createTime === updateTime
                            ? createTime
                            : `${createTime}  (更新于 ${
                                createTime.slice(0, 4) == updateTime.slice(0, 4)
                                  ? updateTime.slice(7)
                                  : updateTime
                              })`}
                        </Typography>
                      </div>
                    )}

                    {category && (
                      <div>
                        <LayerGroupIcon />
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
                      </div>
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

                <Typography variant="body1" className={cssclasses.join(" ")}>
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
                display: { xs: "none", lg: "block" },
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
        description
      }
      fields {
        cover {
          childImageSharp {
            gatsbyImageData
          }
        }
        slug
        cssclasses
        isDoc
        authors
        createTime(formatString: "YYYY 年 M 月 D 日")
        updateTime(formatString: "YYYY 年 M 月 D 日")
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
