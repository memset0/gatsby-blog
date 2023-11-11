import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Main from "../components/Main";
import Seo from "../components/Seo";

import siteMetadata from "../data/metadata";

const awards = [
  { title: "Award 1", description: "Description for Award 1" },
  { title: "Award 2", description: "Description for Award 2" },
  // Add more awards as needed
];

const getTitle = () => "关于";

const AboutPage = () => {
  return (
    <Main maxWidth="sm" title={getTitle()}>
      <Card sx={{ display: "flex", alignItems: "center", m: 2, p: 2 }}>
        <Avatar>
          <StaticImage
            src="../images/avatar-4x.png"
            alt={siteMetadata.author.name}
          />
        </Avatar>
        <CardContent>
          <Typography variant="h5">{siteMetadata.author.name}</Typography>
          <Typography variant="body1">{siteMetadata.author.summary}</Typography>
        </CardContent>
      </Card>

      <div>
        {awards.map((award, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index + 1}a-content`}
              id={`panel${index + 1}a-header`}
            >
              <Typography>{award.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{award.description}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Main>
  );
};

export const Head = () => <Seo title={getTitle()} />;

export default AboutPage;
