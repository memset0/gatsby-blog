import React from "react";
import { graphql } from "gatsby";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Main from "../components/Main";
import Seo from "../components/Seo";

import { checkNegIndent } from "../utils/frontend";
import * as styles from "../style/article.module.less";

const getTitle = ({ data }) => {
  return data.post.frontmatter.title || "Untitled!";
};

const DocTemplate = ({ data, location }) => {
  const { post } = data;

  return (
    <Main maxWidth="lg" title={getTitle({ data })} location={location}>
      <article itemScope itemType="http://schema.org/Article">
        <Grid container spacing={2}>
          {/* 这里是博文 */}
          <Grid item xs={12} lg={9}>
            <Card className={styles.articleCard}>
              <CardContent sx={{ padding: { md: 3 } }}>
                <Typography
                  variant="h5"
                  component="div"
                  className={styles.articleTitle}
                  sx={{ textIndent: checkNegIndent(post.frontmatter.title) ? "-0.35em" : 0 }}
                >
                  {post.frontmatter.title}
                </Typography>

                <Typography variant="body1">
                  <section
                    className="typography"
                    itemProp="articleBody"
                    dangerouslySetInnerHTML={{ __html: post.html }}
                  />
                </Typography>
              </CardContent>
            </Card>
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

export default DocTemplate;

export const pageQuery = graphql`
  query DocTemplate($id: String!, $previousPostId: String, $nextPostId: String) {
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
