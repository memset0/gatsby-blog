import mdastDisableLocalLink from "./mdastDisableLocalLink.mjs";
import mdastImageControl from "./mdastImageControl.mjs";
import remarkSpoiler from "./remarkSpoiler.mjs";
import remarkMark from "./remarkMark.mjs";

function gatsbyRemarkCustom({ markdownAST }) {
  // 禁用指向本地文件的链接
  mdastDisableLocalLink(markdownAST);

  // 支持自定义图片样式控制语法
  mdastImageControl(markdownAST);
}

// 注入自定义remark插件
gatsbyRemarkCustom.setParserPlugins = () => [
  // 支持标记语法
  remarkMark,
  // 支持Spoiler语法
  remarkSpoiler,
];

export default gatsbyRemarkCustom;
