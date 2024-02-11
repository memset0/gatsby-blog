import React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Main from "../components/Main";
import Seo from "../components/Seo";

const getTitle = () => "友情链接";

const FriendsPage = ({ data, location }) => {
  const { friends } = data.site;
  console.log("[friends]", friends);

  return (
    <Main maxWidth="md" title={getTitle()} location={location}>
      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ pl: 2, pr: 2 }}>
          <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>
            友情链接
          </Typography>

          <Grid container spacing={2}>
            {friends.map((friend, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card component="div" href={friend.link} sx={{ height: 150, display: "flex" }}>
                  <CardContent sx={{ width: "calc(100% - 150px)" }}>
                    <Typography variant="h6" sx={{ fontWeight: "strong" }}>
                      {friend.name}
                    </Typography>
                    <Typography variant="body1">{friend.bio}</Typography>
                  </CardContent>
                  <CardMedia component="div" sx={{ width: 150 }}>
                    <GatsbyImage image={getImage(friend.avatar)} alt />
                  </CardMedia>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
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
