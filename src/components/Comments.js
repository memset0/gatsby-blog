import React from "react";
import Giscus from "@giscus/react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const Commments = props => {
  const { slug, ...other } = props;
  if (slug.endsWith("/")) {
    slug = slug.slice(0, -1);
  }

  return (
    <Card {...other}>
      <CardContent sx={{ paddingBottom: "8px !important" }}>
        <Typography variant="h6" gutterBottom>
          评论
        </Typography>
        <Giscus
          id="comments"
          className="comments comments-giscus"
          repo="memset0/blog-comments"
          repoId="MDEwOlJlcG9zaXRvcnkzMDcxNDg0ODA="
          category="Announcements"
          categoryId="DIC_kwDOEk62wM4B_LMQ"
          mapping="specific"
          term={slug}
          strict="1"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="light"
          lang="zh-CN"
        />
      </CardContent>
    </Card>
  );
};

export default Commments;
