/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react";

import siteMetadata from "../data/metadata";
import { umamiConfig } from "../utils/umami";

const Seo = ({ description, title, children }) => {
  const metaDescription = description || siteMetadata.description;
  const defaultTitle = siteMetadata?.title;

  return (
    <>
      <title>{title && title !== defaultTitle ? `${title} - ${defaultTitle}` : defaultTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={siteMetadata?.social?.twitter || ``} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {/* <style>{importantStyles}</style> */}
      {children}

      <script
        async
        defer
        src={umamiConfig.srcUrl}
        data-website-id={umamiConfig.websiteId}
        data-auto-track="false" // 禁用自动跟踪
        data-respect-do-not-track="false" // 不尊重浏览器do-not-track标识
      ></script>
    </>
  );
};

export default Seo;
