import React from "react";
// import { Link as GatsbyLink } from "gatsby";
import { graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import Main from "../components/Main";
import Seo from "../components/Seo";
import MyTimeline from "../components/MyTimeline";
import Comments from "../components/Comments";

import GitHubIcon from "@mui/icons-material/GitHub";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import GlassesIcon from "../components/Icon/GlassesIcon";

import theme from "../theme";
import siteMetadata from "../data/metadata";

const getTitle = () => "关于我";

function TabPanel(props) {
  const { html, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <CardContent
          sx={{
            paddingTop: "8px !important",
            paddingBottom: "8px !important",
            height: "100%",
          }}
        >
          <Typography variant="body1">
            <section
              className="typography"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </Typography>
        </CardContent>
      )}
    </div>
  );
}

const AboutPage = ({ data, location }) => {
  const propsJson = data.pageData.fields.propsJson;
  const props = {};

  // const isMobile = useMediaQuery(() => theme.breakpoints.down("md"));
  const SocialLink = ({ text, href, children }) => (
    <Tooltip
      title={text}
      onClick={() => {
        window.open(href, "_blank");
      }}
      sx={{ cursor: "pointer", margin: "0 4px" }}
    >
      <IconButton size="large">{children}</IconButton>
    </Tooltip>
  );

  for (const prop of JSON.parse(propsJson)) {
    props[prop.key] = prop.value;
  }

  // console.log("[about] page data", data, props);

  return (
    <Main maxWidth="md" title={getTitle()} location={location}>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column" }}>
          <Card sx={{ flexGrow: 1 }}>
            <CardMedia>
              <StaticImage src="../images/avatar-8x.png" alt={siteMetadata.author.name} />
            </CardMedia>
            <CardContent sx={{ paddingBottom: "4px !important" }}>
              <Typography variant="h5">{siteMetadata.author.name}</Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mt: 0.5 }}>
                {siteMetadata.author.summary}
              </Typography>
            </CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 0,
                mb: 1,
              }}
            >
              <SocialLink text="Github" href={siteMetadata.socialLink.github}>
                <GitHubIcon />
              </SocialLink>
              <SocialLink text="Codeforces" href={siteMetadata.socialLink.codeforces}>
                <LeaderboardIcon />
              </SocialLink>
              <SocialLink text="Virtual Judge" href="https://vjudge.net/user/memset0">
                <GlassesIcon />
              </SocialLink>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={8} sx={{ display: "flex", flexDirection: "column" }}>
          <Card>
            <CardContent sx={{ padding: { sm: "12px !important", md: "20px !important" } }}>
              <StaticImage src="../images/tagcloud.png" alt={"关于 " + siteMetadata.author.name} />
            </CardContent>
          </Card>
          <Card sx={{ mt: 2, flexGrow: 1 }}>
            <CardContent sx={{ pb: '1rem !important' }}>
              <Typography variant="body1">
                <section
                  className="typography"
                  itemProp="articleBody"
                  dangerouslySetInnerHTML={{ __html: data.about.html }}
                />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <MyTimeline timeline={props.timeline} sx={{ mt: 2 }} />

      <Comments slug="/about" sx={{ mt: 2 }} />
    </Main>
  );
};

export const Head = () => <Seo title={getTitle()} />;

export default AboutPage;

export const pageQuery = graphql`
  query {
    about: markdownRemark(fileAbsolutePath: {regex: "/about\\.en\\.md$/"}) {
      html
    }
    pageData: markdownRemark(fileAbsolutePath: {regex: "/about\\.data\\.md$/"}) {
      fields {
        propsJson
      }
    }
  }
`;
