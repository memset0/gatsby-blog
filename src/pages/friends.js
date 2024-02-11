import React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Main from "../components/Main";
import Seo from "../components/Seo";

import { shuffle } from "../utils/random";

const getTitle = () => "友情链接";

const FriendsPage = ({ data, location }) => {
  const { friends } = data.site;
  console.log("[friends]", friends);

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateNum = year * 10000 + month * 100 + day;

  shuffle(friends, dateNum);

  return (
    <Main maxWidth="md" title={getTitle()} location={location}>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {friends.map((friend, index) => (
            <Grid item xs={12} lg={6} key={index}>
              <Card component="div" sx={{ height: 150 }}>
                <Button
                  variant="text"
                  component="a"
                  href={friend.link}
                  target="_blank"
                  sx={{ p: 0, display: "flex", width: "100%" }}
                >
                  <CardContent sx={{ width: "calc(100% - 150px)" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      {friend.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "hsla(0,0%,0%,0.72)", textTransform: "none" }}>
                      {friend.bio}
                    </Typography>
                  </CardContent>
                  <CardMedia component="div" sx={{ width: 150 }}>
                    <GatsbyImage image={getImage(friend.avatar)} alt />
                  </CardMedia>
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
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
