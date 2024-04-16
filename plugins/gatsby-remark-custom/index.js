const visit = require("unist-util-visit");

module.exports = ({ markdownAST }) => {
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
      !(alt.endsWith(".png") || alt.endsWith(".jpg") || alt.endsWith(".webp") || alt.endsWith(".svg"))
    ) {
      html += `<span class="image-alt">${alt}</span>`;
    }

    node.type = "html";
    node.value = html;
  });
};
