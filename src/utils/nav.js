const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const matter = require("gray-matter");

function loadPostTitle(filePath) {
  const basename = path.basename(filePath);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath).toString();
    const frontMatter = matter(content).data;
    if (frontMatter.title) {
      return frontMatter.title;
    }
  }
  return basename;
}

function transferToSlug(mixed) {
  if (mixed.endsWith("index.md")) {
    mixed = mixed.slice(0, -9);
  }
  if (mixed.endsWith(".md")) {
    mixed = mixed.slice(0, -3);
  }
  return mixed.replace(/\\/g, "/");
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
        slug: transferToSlug(path.join(slugRoot, filePath)),
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
          slug: transferToSlug(path.join(slugRoot, filePath)),
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

class NavManager {
  constructor() {
    this._navPool = {};
  }
  registerNav(slug, nav) {
    console.log("[nav] register", slug, nav);
    this._navPool[slug] = this.parseNav(nav);
    console.log("[nav] parsed", this._navPool[slug]);
  }
  queryNav(slug) {
    console.log("[nav] query", slug, this._navPool);
    let res = null;
    let len = -1;
    for (const [prefix, nav] of this._navPool.entries())
      if (slug.startsWith(prefix) && prefix.length > len) {
        len = prefix.length;
        res = nav;
      }
    console.log("[nav] query", slug, res);
    return res;
  }
}

module.exports = {
  loadPostTitle,
  parseNav,
  NavManager,
};
