import mdastDisableLocalLink from "./mdastDisableLocalLink.mjs";
import mdastImageControl from "./mdastImageControl.mjs";
import remarkSpoiler from "./remarkSpoiler.mjs";

function gatsbyRemarkCustom({ markdownAST }) {
  // 禁用指向本地文件的链接
  mdastDisableLocalLink(markdownAST);

  // 支持自定义图片样式控制语法
  mdastImageControl(markdownAST);
}

// 注入自定义remark插件
gatsbyRemarkCustom.setParserPlugins = () => [remarkSpoiler];

export default gatsbyRemarkCustom;
