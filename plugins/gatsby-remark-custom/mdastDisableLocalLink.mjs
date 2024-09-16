import visit from "unist-util-visit";

export default function mdastDisableLocalLink(markdownAST) {
  visit(markdownAST, "link", node => {
    if (
      node.url.startsWith("file://") || // 本地文件
      node.url.startsWith("zotero://") || // zotero
      node.url.startsWith("obsidian://") // obsidian
    ) {
      delete node.value;
      node.type = "parent";
      node.data = {
        hName: "span",
        hProperties: {
          className: "m-disabled-link",
        },
      };
    }
  });
}
