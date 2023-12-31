import React from "react";
import { Link as GatsbyLink } from "gatsby";
import { toHtml } from "hast-util-to-html";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { checkNegIndent } from "../../utils/frontend";

const ArticleList = ({ posts }) => {
  return (
    <>
      {posts.map(post => {
        const hasCover = !!post.node.fields.cover;

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
        walk(post.node.excerptAst);

        return (
          <Card sx={{ mt: 2, display: "flex" }} key={post.node.id}>
            <Grid container direction="row-reverse">
              {/* 封面 */}
              <Grid item xs={12} md={5}>
                <GatsbyLink to={post.node.fields.slug} style={{ color: "inherit" }}>
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
                          image={getImage(post.node.fields.cover)}
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
                </GatsbyLink>
              </Grid>

              {/* 内容 */}
              <Grid item xs={12} md={hasCover ? 7 : 12}>
                <Box style={{ display: "flex", flexDirection: "column" }}>
                  <CardContent style={{ flex: "1 0 auto", padding: "20px" }}>
                    <Typography
                      component="div"
                      variant="h6"
                      sx={{
                        lineHeight: 1.35,
                        textIndent: checkNegIndent(post.node.frontmatter.title) ? "-0.3em" : 0,
                      }}
                    >
                      <GatsbyLink
                        to={post.node.fields.slug}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        {post.node.frontmatter.title}
                      </GatsbyLink>
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                      {post.node.frontmatter.date}
                    </Typography>

                    {/* 概要部分 */}
                    <Typography variant="body2" sx={{ minHeight: "16px", marginBottom: "-16px" }}>
                      <section
                        className="typography"
                        itemProp="articleBody"
                        dangerouslySetInnerHTML={{ __html: toHtml(post.node.excerptAst) }}
                      />
                    </Typography>
                  </CardContent>
                </Box>
              </Grid>
            </Grid>
          </Card>
        );
      })}
    </>
  );
};

export default ArticleList;
