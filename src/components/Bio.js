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
      <CardContent sx={{ padding: 3 }}>
        <Grid container alignItems="center">
          <Grid item xs={12} lg={7}>
            <Typography variant="body2" sx={{ marginTop: -2, marginBottom: -2 }}>
              <section
                className="typography"
                itemProp="articleBody"
                dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
              />
            </Typography>
          </Grid>
          <Grid item xs={12} lg={5} sx={{ textAlign: "right", display: { xs: "none", lg: "block" } }}>
            <StaticImage src="../../content/assets/tagcloud-bgwhite.png" alt="tagcloud" height={240} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Bio;
