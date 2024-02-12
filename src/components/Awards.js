import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Timeline from "@mui/lab/Timeline";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent, { timelineOppositeContentClasses } from "@mui/lab/TimelineOppositeContent";

function Text(props) {
  const { content, ...other } = props;
  if (content instanceof Array) {
    return (
      <>
        <Typography {...other}>{content[0]}</Typography>
        <Typography color="text.secondary" {...other}>
          {content[1]}
        </Typography>
      </>
    );
  } else {
    return <Typography {...other}>{content}</Typography>;
  }
}

const Awards = props => {
  let { awards, ...other } = props;

  return (
    <Card {...other}>
      <CardContent sx={{ paddingBottom: "16px !important" }}>
        <Typography variant="h6" gutterBottom>
          我的奖项
        </Typography>
        <Timeline
          sx={{
            mx: -1,
            my: 0.5,
            px: 0,
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.1,
            },
          }}
        >
          {awards.map((award, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent
                color="text.secondary"
                sx={{ m: "auto 0", letterSpacing: "0.2px", px: 1.5 }}
              >
                {award.date}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: "16px" }}>
                <Box sx={{ float: "left" }}>
                  <Text content={award.name} component="div" variant="body1" />
                </Box>
                <Box sx={{ float: "right" }}>
                  <Text
                    content={award.award}
                    component="div"
                    variant="body1"
                    sx={{ fontStyle: "italic", textAlign: "right", opacity: "0.6" }}
                  />
                </Box>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default Awards;
