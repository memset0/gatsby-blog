export function parseTableOfContents(html) {
  if (html.trim() === "") {
    return [];
  }

  html = html
    .replace(/\n/g, "")
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "")
    .replace(/<ul>/g, "<")
    .replace(/<\/ul>/g, ">")
    .replace(/<li>/g, "<")
    .replace(/<\/li>/g, ">");

  const assert = condition => {
    if (!condition) {
      throw new Error("Assertion failed");
    }
  };

  const findMatchL = fl => {
    let i = fl - 1;
    let level = 0;
    while (i >= 0) {
      if (html[i] === ">") {
        ++level;
      }
      if (html[i] === "<") {
        if (level === 0) return i;
        --level;
      }
      i--;
    }
    return -1;
  };
  const findMatchR = fr => {
    let i = fr + 1;
    let level = 0;
    while (i < html.length) {
      if (html[i] === "<") {
        ++level;
      }
      if (html[i] === ">") {
        if (level === 0) return i;
        --level;
      }
      i++;
    }
    return -1;
  };

  const parse = html => {
    // console.log("[toc] parse", html);
    assert(html.startsWith('<a href="') && html.endsWith("</a>"));
    html = html.slice('<a href="'.length, -"</a>".length);
    const href = html.slice(0, html.indexOf('">'));
    const text = html.slice(html.indexOf('">') + 2);
    return { href, text };
  };
  const build = (start, end, level) => {
    // console.log("[toc] build", start, end, html.slice(start, end + 1));
    const result = [];
    assert(html[start] === "<");
    assert(html[end] === ">");
    let i = start + 1;
    while (i < end) {
      const j = findMatchR(i);
      // console.log("[toc] find match", i, j, html.slice(i, j + 1));
      assert(j !== -1);
      let cur;
      if (html[j - 1] === ">" && html[j - 2] !== "a") {
        const k = findMatchL(j - 1);
        cur = parse(html.slice(i + 1, k));
        cur.children = build(k, j - 1, level + 1);
      } else {
        cur = parse(html.slice(i + 1, j));
      }
      cur.level = level;
      result.push(cur);
      i = j + 1;
    }
    return result;
  };

  // console.log("[toc] html =", html);
  const ast = build(0, html.length - 1, 0);
  // console.log("[toc] ast", ast);
  return ast;
}
