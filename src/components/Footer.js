import React from "react";
import { Link as GatsbyLink } from "gatsby";
import { Box, Typography, Link, Grid, Divider, useTheme, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import metadata from "../data/metadata";

const textStyle = ({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
});

const StyledTypography = styled(Typography)(textStyle);

const linkStyle = ({ theme }) => ({
  fontSize: "0.875rem",
  textDecoration: "none",
  position: "relative",
  transition: "color 0.3s ease",
  "&:hover": {
    color: theme.palette.primary.main,
    "&::after": {
      width: "100%",
      left: 0,
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    width: 0,
    height: "1.5px",
    bottom: "-1px",
    right: 0,
    backgroundColor: theme.palette.primary.main,
    transition: "width 0.3s ease, left 0.3s ease",
  },
});

const StyledLink = styled(Link)(textStyle, linkStyle);
const StyledGatsbyLink = styled(GatsbyLink)(textStyle, linkStyle);

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        pt: 6,
        pb: 4,
        px: 1,
        fontSize: "0.8rem",
        backgroundColor: "transparent",
        mt: "auto",
      }}
    >
      <Container maxWidth="md" sx={{ px: "0 !important" }}>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={6}>
            <Grid
              container
              justifyContent="flex-start"
              alignItems="flex-start"
              direction="column"
              spacing={0.5}
            >
              <Grid item xs="auto">
                <StyledTypography>
                  © 2018-{new Date().getFullYear()}{" "}
                  <StyledGatsbyLink to="/about">{metadata.author.name}</StyledGatsbyLink>.
                </StyledTypography>
              </Grid>
              <Grid item xs="auto">
                <StyledTypography>All rights reserved.</StyledTypography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6}>
            <Grid container justifyContent="flex-end" alignItems="flex-end" direction="column" spacing={0.5}>
              <Grid item xs="auto">
                <StyledTypography>
                  <StyledLink
                    href="https://github.com/memset0/gatsby-blog"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source Code
                  </StyledLink>
                </StyledTypography>
              </Grid>
              <Grid item xs="auto">
                <StyledTypography>
                  Built with{" "}
                  <StyledLink href="https://gatsbyjs.org/" target="_blank" rel="noopener noreferrer">
                    Gatsby.js
                  </StyledLink>
                </StyledTypography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider
          sx={{
            mx: 0.5,
            my: 2,
            backgroundColor: "rgba(0, 0, 0, 0.08)",
          }}
        />

        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={6}>
            <Grid container justifyContent="flex-start">
              <StyledTypography>Made with ❤️ in China</StyledTypography>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container justifyContent="flex-end">
              <StyledLink href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
                {metadata.icp}
              </StyledLink>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
