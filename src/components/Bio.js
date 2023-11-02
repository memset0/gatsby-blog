import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

const Bio = () => {
  const data = useStaticQuery(graphql`
    query {
      markdownRemark(fileAbsolutePath: {regex: "/bio\\.md$/"}) {
        html
        frontmatter {
          title
        }
      }
    }
  `);

  return (
    <Card>
      <CardContent
        sx={{ ml: 1, mr: 1, paddingTop: "4px", paddingBottom: "4px" }}
      >
        <Grid container>
          <Grid item xs={12} lg={7}>
            <Typography variant="body1" class="typography">
              <section
                dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
                itemProp="articleBody"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} lg={5}>
            <StaticImage src="/assets/tagcloud.png" alt="tagcloud" />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Bio;
