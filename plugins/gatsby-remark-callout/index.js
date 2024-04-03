const visit = require("unist-util-visit");

module.exports = ({ markdownAST }) => {
  function transformToCallout(node) {
    const target = node.children[0].children[0].value;
    const type = target.slice(2, target.indexOf("]"));
    let collapse = false;
    if (target[target.indexOf("]") + 1] === "-") {
      collapse = true;
    }

    let headingEndBlock = -1;
    let headingEndPos = -1;
    for (let i = 0; i < node.children[0].children.length; i++) {
      if (
        node.children[0].children[i].type == "text" &&
        node.children[0].children[i].value.indexOf("\n") !== -1
      ) {
        headingEndBlock = i;
        headingEndPos = node.children[0].children[i].value.indexOf("\n");
        break;
      }
    }

    let heading;
    if (headingEndBlock == -1 && headingEndPos == -1) {
      heading = node.children[0].children;
      node.children[0].children = [];
    } else {
      // 从中提取出标题部分
      heading = node.children[0].children.slice(0, headingEndBlock);
      heading.push(JSON.parse(JSON.stringify(node.children[0].children[headingEndBlock]))); // 最后一个 section 要 clone，以免在下面被修改
      heading[heading.length - 1].value = heading[heading.length - 1].value.slice(0, headingEndPos);
      heading[0].value = heading[0].value.slice(type.length + 3); // +3 是因为考虑到多了 ![] 三个字符
      if (collapse) {
        // 如果是折叠的话，还要在 +1，因为有字符 -
        heading[0].value = heading[0].value.slice(1);
      }
      if (heading.length === 1 && heading[0].type === "text" && heading[0].value.trim() === "") {
        // 如果没有指定 Callout 的标题，则根据类型自动生成
        heading[0].value = type[0].toUpperCase() + type.slice(1);
      }

      // 从中删掉标题部分
      node.children[0].children = node.children[0].children.slice(headingEndBlock);
      node.children[0].children[0].value = node.children[0].children[0].value.slice(headingEndPos);
    }

    node.type = "paragraph";
    node.children.unshift({
      type: "html",
      value: `</summary><div class="callout-content">`,
    });
    for (let i = heading.length - 1; i >= 0; i--) {
      node.children.unshift(heading[i]);
    }
    node.children.unshift({
      type: "html",
      value: `<details ${collapse ? "" : "open disabled"} class="callout callout-type-${type}"><summary>`,
    });

    node.children.push({
      type: "html",
      value: "</div></details>",
    });
  }

  visit(markdownAST, "blockquote", node => {
    if (
      !(
        node.children[0].type == "paragraph" &&
        node.children[0].children[0].type == "text" &&
        node.children[0].children[0].value.startsWith("[!")
      )
    ) {
      return;
    }

    try {
      transformToCallout(node);
    } catch (error) {
      console.error("[callout] build failed:", error, JSON.stringify(node, null, 2));
      throw error;
    }
  });
};
