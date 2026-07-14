export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("CNAME");

  // Obsidian / plugin folders — never publish these
  for (const pattern of [
    "**/posts/.obsidian/**",
    "**/posts/.trash/**",
    "**/posts/.makemd/**",
    "**/posts/.space/**",
    "**/posts/Tags/**",
  ]) {
    eleventyConfig.ignores.add(pattern);
  }

  function isPublishedPost(item) {
    const path = String(item.inputPath).replaceAll("\\", "/");
    return (
      path.includes("/posts/") &&
      path.endsWith(".md") &&
      !path.includes("/.") &&
      !path.includes("/Tags/")
    );
  }

  function relativeStem(item) {
    const path = String(item.inputPath).replaceAll("\\", "/");
    const after = path.split("/posts/")[1] || "";
    return after.replace(/\.md$/i, "");
  }

  function realPosts(api) {
    return api.getAll().filter(isPublishedPost);
  }

  eleventyConfig.addCollection("posts", (api) =>
    realPosts(api).sort((a, b) => b.date - a.date),
  );

  eleventyConfig.addCollection("rootPosts", (api) =>
    realPosts(api)
      .filter((p) => !relativeStem(p).includes("/"))
      .sort((a, b) => b.date - a.date),
  );

  eleventyConfig.addCollection("rootFolders", (api) => {
    const folders = new Set();
    for (const p of realPosts(api)) {
      const rel = relativeStem(p);
      if (rel.includes("/")) folders.add(rel.split("/")[0]);
    }
    return [...folders].filter(Boolean).sort();
  });

  eleventyConfig.addCollection("allFolders", (api) => {
    const folders = new Set();
    for (const p of realPosts(api)) {
      const parts = relativeStem(p).split("/");
      for (let i = 1; i < parts.length; i++) {
        folders.add(parts.slice(0, i).join("/"));
      }
    }
    return [...folders].filter(Boolean).sort();
  });

  eleventyConfig.addFilter("filesize", (content) => {
    const bytes = Buffer.byteLength(String(content ?? ""), "utf8");
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} kB`;
  });

  eleventyConfig.addFilter("apacheDate", (date) => {
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return "-";
    const day = String(d.getUTCDate()).padStart(2, "0");
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const month = months[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    const hours = String(d.getUTCHours()).padStart(2, "0");
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  });

  eleventyConfig.addFilter("postBasename", (item) => {
    const rel = relativeStem(item);
    return rel.split("/").pop();
  });

  eleventyConfig.addFilter("postsInFolder", (posts, folder) => {
    const prefix = `${folder}/`;
    return posts.filter((p) => {
      const rel = relativeStem(p);
      if (!rel.startsWith(prefix)) return false;
      const rest = rel.slice(prefix.length);
      return !rest.includes("/");
    });
  });

  eleventyConfig.addFilter("childFolders", (allFolders, folder) => {
    const prefix = `${folder}/`;
    return allFolders.filter((f) => {
      if (!f.startsWith(prefix)) return false;
      const rest = f.slice(prefix.length);
      return rest.length > 0 && !rest.includes("/");
    });
  });

  eleventyConfig.addFilter("parentHref", (folder) => {
    const parts = String(folder).split("/").filter(Boolean);
    if (parts.length <= 1) return "/";
    return `/${parts.slice(0, -1).join("/")}/`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
