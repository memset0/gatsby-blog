import React from "react";
import Giscus from "@giscus/react";

const Commments = ({ slug }) => {
  if (slug.endsWith("/")) {
    slug = slug.slice(0, -1);
  }

  return (
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
  );
};

export default Commments;
