module.exports = {
  blog: {
    name: "博客",
    children: {
      travelogue: { name: "游记" },
      "high-school": {
        name: "高考",
        children: {
          math: { name: "数学" },
        },
      },
    },
  },
  oi: {
    name: "算法竞赛",
    children: {
      algorithm: { name: "算法笔记" },
      solution: { name: "题解" },
      training: { name: "训练" },
    },
  },
  dev: {
    name: "开发札记",
  },
  course: {
    name: "课程笔记",
    doc: true,
    useHeader: true,
    children: {
      "gen-ed": {
        name: "通识课程",
      },
    },
  },
};
