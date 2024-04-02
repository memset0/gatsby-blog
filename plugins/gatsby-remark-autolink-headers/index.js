const toString = require(`mdast-util-to-string`);
const visit = require(`unist-util-visit`);

function patch(context, key, value) {
  if (!context[key]) {
    context[key] = value;
  }
  return context[key];
}

function naiveHash(str, seed = 0) {
  // forked from https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, 0) + (h1 >>> 0).toString(16).padStart(8, 0);
}

const svgIcon = `<svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`;

module.exports = (
  { markdownAST },
  { icon = svgIcon, isIconAfterHeader = false, className = `anchor`, elements = null }
) => {
  visit(markdownAST, `heading`, node => {
    // If elements array exists, do not create links for heading types not included in array
    if (Array.isArray(elements) && !elements.includes(`h${node.depth}`)) {
      return;
    }

    const id = className + "-" + naiveHash(toString(node));
    const data = patch(node, `data`, {});

    patch(data, `id`, id);
    patch(data, `htmlAttributes`, {});
    patch(data, `hProperties`, {});
    patch(data.htmlAttributes, `id`, id);
    patch(data.hProperties, `id`, id);

    if (icon !== false) {
      patch(data.hProperties, `style`, `position: relative;`);
      const label = id.split(`-`).join(` `);
      const method = isIconAfterHeader ? `push` : `unshift`;
      node.children[method]({
        type: `link`,
        url: `#${id}`,
        title: null,
        children: [],
        data: {
          hProperties: {
            "aria-label": `${label} permalink`,
            class: `${className} ${isIconAfterHeader ? `after` : `before`}`,
          },
          hChildren: [{ type: `raw`, value: icon }],
        },
      });
    }
  });

  return markdownAST;
};
