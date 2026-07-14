export default {
  layout: "post.njk",
  tags: "posts",
  permalink: (data) => {
    const input = String(data.page.inputPath).replaceAll("\\", "/");
    const after = input.split("/posts/")[1];
    if (!after) return false;
    return `/${after.replace(/\.md$/i, "")}.html`;
  },
};
