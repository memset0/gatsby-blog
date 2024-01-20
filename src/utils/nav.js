const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const matter = require("gray-matter");

module.exports = {
  parseNav,
  loadPostTitle,
};

function loadPostTitle(filePath) {
  const basename = path.basename(filePath);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath).toString();
    const frontMatter = matter(content);
    if (frontMatter.title) {
      return frontMatter.title;
    }
  }
  return basename;
}

function parseNav(fileRoot, slugRoot, source) {
  const result = [];
  for (const item of source) {
    if (typeof item === "string") {
      let filePath = item;
      if (!filePath.endsWith(".md")) {
        filePath = filePath.slice(0, -3);
      }
      result.push({
        slug: path.join(slugRoot, filePath.slice(0, -3)).replace(/\\/g, "/"),
        file: path.join(fileRoot, filePath),
        title: loadPostTitle(path.join(fileRoot, filePath)),
      });
    } else {
      const key = Object.keys(item)[0];
      const value = Object.values(item)[0];
      if (typeof value === "string") {
        let filePath = value;
        if (!filePath.endsWith(".md")) {
          filePath = filePath.slice(0, -3);
        }
        result.push({
          slug: path.join(slugRoot, filePath.slice(0, -3)).replace(/\\/g, "/"),
          file: path.join(fileRoot, filePath),
          title: loadPostTitle(path.join(fileRoot, key)),
        });
      } else {
        result.push({
          title: key,
          children: parseNav(fileRoot, slugRoot, value),
        });
      }
    }
  }
  return result;
}

if (!module.parent) {
  console.log(
    JSON.stringify(
      parseNav(
        "",
        "/",
        YAML.parse(`- 课程简介: index.md
- test.md
- 笔记:
  - 'note/1.md'
  - 'note/2.md'
  - 'note/3.md'
  - 'note/4.md'
  - 'note/5.md'`)
      ),
      null,
      2
    )
  );
}
