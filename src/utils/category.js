module.exports = {
  flatCategories,
};

function flatCategories(categoryTree) {
  const categories = [];
  const walk = (treeNode, slug) => {
    const children = [];
    if (treeNode.children) {
      for (const key in treeNode.children) {
        children.push({ key, name: treeNode.children[key].name });
        walk(treeNode.children[key], `${slug}${key}/`);
      }
    }
    const current = {
      slug,
      name: treeNode.name,
      node: treeNode,
    };
    if (children.length) {
      current.children = children;
    }
    categories.push(current);
  };
  for (const key in categoryTree) {
    walk(categoryTree[key], `/${key}/`);
  }
  return categories;
}
