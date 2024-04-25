import React from "react";
import { Link as GatsbyLink } from "gatsby";
import { graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import GitHubIcon from "@mui/icons-material/GitHub";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import GlassesIcon from "../components/Icon/GlassesIcon";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Main from "../components/Main";
import Seo from "../components/Seo";
import MyTimeline from "../components/MyTimeline";
import Comments from "../components/Comments";

import theme from "../theme";
import siteMetadata from "../data/metadata";

// const timeline = [
//   { title: "Award 1", description: "Description for Award 1" },
//   { title: "Award 2", description: "Description for Award 2" },
//   // Add more timeline as needed
// ];

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

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const isMobile = useMediaQuery(() => theme.breakpoints.down("md"));
  const SocialLink = ({ text, href, children }) => (
    <ListItemButton component={GatsbyLink} href={href} target="_blank" sx={{ px: isMobile ? 3 : 2 }}>
      <ListItemIcon>{children}</ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </ListItemButton>
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
            <List dense={!isMobile}>
              <SocialLink text="Github" href={siteMetadata.socialLink.github}>
                <GitHubIcon fontSize="small" />
              </SocialLink>
              <SocialLink text="Codeforces" href={siteMetadata.socialLink.codeforces}>
                <LeaderboardIcon fontSize="small" />
              </SocialLink>
              <SocialLink text="Virtual Judge" href="https://vjudge.net/user/memset0">
                <GlassesIcon fontSize="small" />
              </SocialLink>
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={8} sx={{ display: "flex", flexDirection: "column" }}>
          <Card>
            <CardContent sx={{ padding: { sm: "12px !important", md: "20px !important" } }}>
              <StaticImage src="../images/tagcloud.png" alt={"关于 " + siteMetadata.author.name} />
            </CardContent>
          </Card>
          <Card sx={{ mt: 2, flexGrow: 1 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleChange}>
                <Tab label="English" sx={{ minWidth: "50%" }} />
                <Tab label="中文" sx={{ minWidth: "50%" }} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0} html={data.en.html} />
            <TabPanel value={value} index={1} html={data.cn.html} />
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
    en: markdownRemark(fileAbsolutePath: {regex: "/about\\.en\\.md$/"}) {
      html
    }
    cn: markdownRemark(fileAbsolutePath: {regex: "/about\\.cn\\.md$/"}) {
      html
    }
    pageData: markdownRemark(fileAbsolutePath: {regex: "/about\\.data\\.md$/"}) {
      fields {
        propsJson
      }
    }
  }
`;
