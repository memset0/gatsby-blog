import React from "react";
// import { graphql, useStaticQuery } from "gatsby";
// import { StaticImage } from "gatsby-plugin-image";
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
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

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

const MyTimeline = props => {
  let { timeline, ...other } = props;

  return (
    <Card {...other}>
      <CardContent sx={{ paddingBottom: "16px !important" }}>
        <Typography variant="h6" gutterBottom>
          Timeline
        </Typography>
        <Timeline
          sx={{
            mx: -1,
            my: 0.5,
            px: 0,
            [`& .${timelineOppositeContentClasses.root}`]: {
              maxWidth: "5.5em",
            },
          }}
        >
          {timeline.map((item, index) => (
            <Box
              component="a"
              href={item.href}
              target="_blank"
              rel="noreferrer"
              sx={{
                color: "inherit",
                textDecoration: "none",
                "& .MuiTypography-root": { transition: "opacity 0.2s" },
                "&:hover .MuiTypography-root": { opacity: 0.65 },
              }}
            >
              <TimelineItem key={index}>
                <TimelineOppositeContent
                  color="text.secondary"
                  sx={{ m: "auto 0", letterSpacing: "0.2px", px: 1.5 }}
                >
                  {item.date}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector sx={{ opacity: index === 0 ? 0 : 1 }} />
                  <TimelineDot>{item.type === "award" && <EmojiEventsIcon fontSize="small" />}</TimelineDot>
                  <TimelineConnector sx={{ opacity: index + 1 === timeline.length ? 0 : 1 }} />
                </TimelineSeparator>
                <TimelineContent sx={{ py: "24px", px: "16px" }}>
                  <Box sx={{ float: "left" }}>
                    <Text content={item.name} component="div" variant="body1" />
                  </Box>
                  {item.award && (
                    <Box sx={{ float: "right" }}>
                      <Text
                        content={item.award}
                        component="div"
                        variant="body1"
                        sx={{ fontStyle: "italic", textAlign: "right", opacity: "0.72" }}
                      />
                    </Box>
                  )}
                </TimelineContent>
              </TimelineItem>
            </Box>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default MyTimeline;
