import React from "react";
// import { useState, useEffect, useRef } from "react";
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

import theme from "../theme";
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

  // const [count, setCount] = useState(0);
  // const [isVisible, setIsVisible] = useState(false);
  // const counterRef = useRef(null);

  // function forceLeadingZeros(value, targetValue) {
  //   function countDigits(value) {
  //     if (value === 0) {
  //       return 0;
  //     }
  //     return countDigits(Math.floor(value / 10)) + 1;
  //   }

  //   let result = "";
  //   for (let i = 0; i < countDigits(targetValue) - countDigits(value); i++) {
  //     result += "0";
  //   }
  //   return value ? result + value : result;
  // }

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting && !isVisible) {
  //         setIsVisible(true);
  //       }
  //     },
  //     { threshold: 0.1 }
  //   );

  //   if (counterRef.current) {
  //     observer.observe(counterRef.current);
  //   }

  //   return () => observer.disconnect();
  // }, [isVisible]);

  // useEffect(() => {
  //   if (isVisible && count < friends.length) {
  //     const timer = setInterval(() => {
  //       setCount(prev => {
  //         const next = prev + 1;
  //         if (next >= friends.length) {
  //           clearInterval(timer);
  //         }
  //         return next;
  //       });
  //     }, Math.max(1, Math.floor((count * count) / (friends.length * 10))));

  //     return () => clearInterval(timer);
  //   }
  // }, [isVisible, friends.length, count]);

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
            <Typography sx={{ fontSize: "1.06rem", color: theme.palette.text.primary }}>
              哈喽哈喽！这里是 mem 的友链墙，墙上已经有
              {/* <span
                ref={counterRef}

                style={{
                  display: "inline-block",
                  // fontWeight: "bold",
                  paddingLeft: "0.2rem",
                  paddingRight: "0.2rem",
                }}
              >
                {forceLeadingZeros(count, friends.length)}
              </span> */}
              {" " + friends.length + " "}
              位好朋友了喔~ 卡片会以 24h 为周期随机排序。想要交换友链的话，欢迎在下方评论区留下你的博客地址！
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
