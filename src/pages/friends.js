import React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Main from "../components/Main";
import Seo from "../components/Seo";
import Footer from "../components/Footer";
import HoverableCard from "../components/HoverableCard";
import Comments from "../components/Comments";

import { shuffle } from "../utils/random";

const getTitle = () => "友情链接";

const FriendsPage = ({ data, location }) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateHash = year * 10000 + month * 100 + day;

  const friends = JSON.parse(JSON.stringify(data.site.friends));
  shuffle(friends, dateHash);

  const cardHeight = 120;

  return (
    <Main maxWidth="lg" title={getTitle()} location={location}>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {friends.map((friend, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <HoverableCard component="div" sx={{ height: cardHeight }}>
                <Button
                  variant="text"
                  component="a"
                  href={friend.link}
                  target="_blank"
                  sx={{ p: 0, display: "flex", width: "100%" }}
                >
                  <CardContent sx={{ width: `calc(100% - ${cardHeight}px)` }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      {friend.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "hsla(0,0%,0%,0.72)", textTransform: "none" }}>
                      {friend.bio}
                    </Typography>
                  </CardContent>
                  <CardMedia component="div" sx={{ width: cardHeight }}>
                    <GatsbyImage image={getImage(friend.avatar)} alt={friend.name} />
                  </CardMedia>
                </Button>
              </HoverableCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Container maxWidth="md" disableGutter={true} sx={{ p: "0 !important" }}>
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ paddingBottom: "1rem !important" }}>
            <Typography>
              这里是 mem 的友链墙喵~ 卡片顺序以 24h 为周期随机打乱。如果您也想交换友链的话请在下方评论区留言……
            </Typography>
          </CardContent>
        </Card>

        <Comments slug="/friends" sx={{ mt: 2 }} />

        <Footer />
      </Container>
    </Main>
  );
};

export const Head = () => <Seo title={getTitle()} />;

export default FriendsPage;

export const pageQuery = graphql`
  query {
    site {
      friends {
        link
        name
        bio
        avatarUrl
        avatar {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
  }
`;
