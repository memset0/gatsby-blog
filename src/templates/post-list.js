import React from "react";
import { Link as GatsbyLink, graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { toHtml } from "hast-util-to-html";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Main from "../components/Main";
import Seo from "../components/Seo";
import HoverableCard from "../components/HoverableCard";
import CalendarAltIcon from "../components/Icon/CalendarAltIcon";
import LayerGroupIcon from "../components/Icon/LayerGroupIcon";

import theme from "../theme";
import siteMetadata from "../data/metadata";
import { checkNegIndent } from "../utils/frontend";

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
  const posts = data.posts.edges;

  return (
    <Main maxWidth="md" title={getTitle({ data, pageContext })} location={location}>
      {posts.map(postNode => {
        const post = postNode.node;
        const hasCover = !!post.fields.cover;
        // console.log("[post]", post);

        const walk = node => {
          if (node instanceof Array) {
            for (const child of node) walk(child);
          } else {
            if (node.tagName && node.tagName === "blockquote") {
              node.tagName = "div";
            }
            if (node.children) {
              walk(node.children);
            }
          }
        };
        walk(post.excerptAst);

        return (
          <HoverableCard sx={{ mt: 2.5, display: "flex" }} key={post.id}>
            <Grid container direction="row-reverse">
              {/* 封面 */}
              <Grid item xs={12} md={5}>
                <Link
                  component={GatsbyLink}
                  to={post.fields.slug}
                  sx={{
                    color: theme.palette.primary.main,
                  }}
                >
                  <CardActionArea sx={{ height: "100%" }}>
                    {hasCover && (
                      <CardMedia
                        component="div"
                        sx={{
                          width: "100%",
                          height: "100%",
                          maxHeight: { xs: "18rem", md: "100%" },
                        }}
                      >
                        <GatsbyImage
                          image={getImage(post.fields.cover)}
                          style={{
                            position: "relative",
                            height: "100%",
                          }}
                          imgStyle={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                          alt=""
                        />
                      </CardMedia>
                    )}
                  </CardActionArea>
                </Link>
              </Grid>

              {/* 内容 */}
              <Grid item xs={12} md={hasCover ? 7 : 12}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flex: "1 0 auto", p: 2.5 }}>
                    <Typography
                      component="div"
                      variant="h6"
                      sx={{
                        lineHeight: 1.35,
                        mb: 0.75,
                        textIndent: checkNegIndent(post.frontmatter.title) ? "-0.35em" : 0,
                      }}
                    >
                      <Link
                        component={GatsbyLink}
                        to={post.fields.slug}
                        sx={{
                          color: "inherit",
                          textDecoration: "none",
                        }}
                      >
                        {post.frontmatter.title}
                      </Link>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="grey.500"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        "& svg": { ml: 1.5, mr: 0.75 },
                        "& :first-child": { ml: 0 },
                      }}
                    >
                      <CalendarAltIcon fontSize="tiny" />
                      <span style={{ wordSpacing: "-2px" }}> {post.frontmatter.date}</span>
                      <LayerGroupIcon fontSize="tiny" />
                      <Breadcrumbs
                        aria-label="breadcrumb"
                        sx={{
                          color: "inherit",
                          fontSize: "inherit",
                          display: "inline-block",
                          "& .MuiBreadcrumbs-separator": { mx: 0.5 },
                        }}
                      >
                        {JSON.parse(post.fields.category).map(({ name, to }, index) => (
                          <Link component={GatsbyLink} underline="hover" color="inherit" to={to} key={index}>
                            {name}
                          </Link>
                        ))}
                      </Breadcrumbs>
                    </Typography>

                    {/* 概要部分 */}
                    <Typography variant="body2" sx={{ minHeight: 2, mb: -1.5 }}>
                      <section
                        className="typography"
                        itemProp="articleBody"
                        dangerouslySetInnerHTML={{ __html: toHtml(post.excerptAst) }}
                      />
                    </Typography>
                  </CardContent>
                </Box>
              </Grid>
            </Grid>
          </HoverableCard>
        );
      })}

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
            date(formatString: "YYYY-MM-DD")
          }
          fields {
            slug
            category
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
