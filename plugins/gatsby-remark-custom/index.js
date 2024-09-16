const visit = require("unist-util-visit");

module.exports = ({ markdownAST }) => {
  // 支持使用==语法表示内容高亮
  visit(markdownAST, "text", node => {
    const regex = /==(.+?)==/g;
    if (regex.test(node.value)) {
      const newNodes = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          newNodes.push({
            type: "text",
            value: node.value.slice(lastIndex, match.index),
          });
        }
        newNodes.push({
          type: "html",
          value: `<mark>${match[1]}</mark>`,
        });
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < node.value.length) {
        newNodes.push({
          type: "text",
          value: node.value.slice(lastIndex),
        });
      }

      return newNodes;
    }
  });

  // 支持双链语法
  // visit(markdownAST, "link", node => {
  //   const text = node.value;
  //   const link = node.url;
  //   const doubleLink = text + "[" + link + "]";
  //   node.value = doubleLink;
  // });

  // 禁用一些无法点击的本地连接
  visit(markdownAST, "link", node => {
    if (
      node.url.startsWith("file://") || // 本地文件
      node.url.startsWith("zotero://") || // zotero
      node.url.startsWith("obsidian://") // obsidian
    ) {
      console.log("[link]", node);
      delete node.value;
      node.type = "parent";
      node.data = {
        hName: "span",
        hProperties: {
          className: "m-disabled-link",
        },
      };
      console.log("[link]", node);
    }
  });

  // 支持自定义图片样式控制语法
  visit(markdownAST, "image", node => {
    let html = `<img src="${node.url}"`;

    let data = node.alt;
    let alt = "";
    let pattern = "";
    if (data.includes("|")) {
      alt = data.split("|")[0];
      pattern = data.split("|")[1];
    } else if (!isNaN(Number(data), 10)) {
      pattern = data;
    }
    html += 'alt="' + alt.replace(/\"/g, '\\"') + '" ';

    if (pattern) {
      html += 'style="';
      for (const plain of pattern.split(";")) {
        const word = plain.trim();
        if (!isNaN(Number(word), 10)) {
          html += "width: " + word + "px; ";
        } else if (word.endsWith("em")) {
          html += "width: " + word + "; ";
        } else {
          switch (word) {
            case "sm":
              html += "width: 300px; ";
              break;
            case "md":
              html += "width: 450px; ";
              break;
            case "lg":
              html += "width: 600px; ";
              break;
            case "xl":
              html += "width: 768px; ";
              break;
            default:
              html += word + "; ";
          }
        }
      }
      html += '" ';
    }

    html += ">";
    if (
      alt &&
      !(
        alt.endsWith(".png") ||
        alt.endsWith(".jpg") ||
        alt.endsWith(".jpeg") ||
        alt.endsWith(".webp") ||
        alt.endsWith(".svg")
      )
    ) {
      html += `<span class="image-alt">${alt}</span>`;
    }

    node.type = "html";
    node.value = html;
  });
};
