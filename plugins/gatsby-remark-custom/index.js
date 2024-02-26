const visit = require("unist-util-visit");

module.exports = ({ markdownAST }) => {
  visit(markdownAST, "image", node => {
    let html = `<img src="${node.url}"`;

    let alt = "";
    let pattern = "";
    if (node.alt.includes("|")) {
      alt = node.alt.split("|")[0];
      pattern = node.alt.split("|")[1];
    }
    html += 'alt="' + alt.replace(/\"/g, '\\"') + '" ';

    if (pattern) {
      html += 'style="';
      for (const plain of pattern.split(";")) {
        const word = plain.trim();
        if (word.endsWith("em")) {
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
    if (alt) {
      html += `<span class="image-alt">${alt}</span>`;
    }

    node.type = "html";
    node.value = html;
  });
};
