const visit = require("unist-util-visit");

module.exports = ({ markdownAST }) => {
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

    const target = node.children[0].children[0].value;
    const heading = target.slice(0, target.indexOf("\n") == -1 ? target.length : target.indexOf("\n"));

    const type = heading.slice(2, heading.indexOf("]"));
    // if (!Object.keys(config.theme).includes(type)) {
    //   return;
    // }

    let title = heading.slice(heading.indexOf("]") + 1).trim();
    let collapse = false;
    if (title.startsWith("-")) {
      collapse = true;
      title = title.slice(1).trim();
    }
    if (!title) {
      title = type[0].toUpperCase() + type.slice(1);
    }

    node.children[0].children[0].value = node.children[0].children[0].value.slice(heading.length);
    node.type = "paragraph";
    node.children.unshift({
      type: "html",
      value: `<details ${
        collapse ? "" : "open"
      } class="callout callout-type-${type}"><summary>${title}</summary><div>`,
    });
    node.children.push({
      type: "html",
      value: "</div></details>",
    });
    console.log(node.children);
    console.log(">note", "!!!", heading, type, title);
  });
};
