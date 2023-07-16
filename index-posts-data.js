const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const moment = require("moment");

async function runFs() {
  const timestampStart = Date.now();

  const fetchBlogs = fs.promises.readdir(path.resolve(__dirname, "blogs"));
  const fetchWorks = fs.promises.readdir(path.resolve(__dirname, "works"));

  const [blogsData, worksData] = await Promise.all([fetchBlogs, fetchWorks]);

  const processBlogs = process(blogsData, "blogs");
  const processWorks = process(worksData, "works");

  const [blogs, works] = await Promise.all([processBlogs, processWorks]).then(
    ([blogsData, worksData]) => {
      const sortedBlogs = blogsData.sort((a, b) => {
        return moment(b.createdAt).diff(moment(a.createdAt));
      });
      const sortedWorks = worksData.sort((a, b) => {
        return moment(b.createdAt).diff(moment(a.createdAt));
      });

      return [sortedBlogs, sortedWorks];
    }
  );

  const dbPath = path.resolve(__dirname, "@db");
  const blogsIndexPath = path.resolve(dbPath, "blogsIndex.json");
  const worksIndexPath = path.resolve(dbPath, "worksIndex.json");
  fs.writeFileSync(blogsIndexPath, JSON.stringify(blogs, null, 2));
  fs.writeFileSync(worksIndexPath, JSON.stringify(works, null, 2));

  console.log("Done");
  console.log("Process time:", Date.now() - timestampStart, "ms");
}

function process(data, category) {
  return Promise.all(
    data.map(async (file) => {
      const fileData = await fs.promises.readFile(
        path.resolve(__dirname, category, file),
        "utf8"
      );
      const markdownData = matter(fileData);

      let content = markdownData.content;
      // check if markdownContent start with \n, if yes remove the first line break
      if (content.startsWith("\n")) {
        content = content.slice(1);
      }

      // markdown.data.tags if null return either null / [null]
      // make it empty array if null
      let tags = [];
      if (Array.isArray(markdownData.data.tags) && markdownData.data.tags[0]) {
        tags = markdownData.data.tags;
      }

      // Create summary from markdown content
      const summary = content
        .replace(/!\[\[([^\]]+)\]\]/g, "")
        .replace(/<[^>]*>?/gm, "")
        .replace(/#+\s/g, "")
        .split("\n")
        .slice(0, 3) // Take 2 first lines, it use 3 because frontmatter content start with \n
        .join(" ")
        .trim();

      let thumbnail = markdownData.data.thumbnail || "/img/banner.webp";
      // Check if thumbnail is a wikilink image, if yes, get the image name
      if (/!\[\[([^\]]+)\]\]/g.test(thumbnail)) {
        thumbnail = thumbnail.match(/!\[\[([^\]]+)\]\]/)?.[1] ?? "logo.webp";
        thumbnail = `@attachments/banner/${thumbnail}`;
      } else {
        thumbnail = thumbnail.replace(/"/g, "").replace(/\\/g, "");
        // Check if it's a url, if yes add @url prefix
        if (thumbnail.startsWith("http")) {
          thumbnail = thumbnail.split("://")[1];
          thumbnail = `@url/${thumbnail}`;
        } else {
          thumbnail = `@local${thumbnail}`;
        }
      }

      return {
        title: markdownData.data.title ?? file.replace(".md", "") ?? "untitled",
        summary,
        createdAt:
          markdownData.data.createdAt ??
          moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ"),
        updatedAt:
          markdownData.data.updatedAt ??
          moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ"),
        thumbnail: thumbnail ?? "/img/banner.webp",
        thumbnail_y: markdownData.data.thumbnail_y ?? 0.5,
        thumbnail_x: markdownData.data.thumbnail_x ?? 0.5,
        tags,
        path: `/${category}/${file.replace(".md", "")}`,
      };
    })
  );
}

runFs().catch((error) => {
  console.error(error);
  process.exit(1);
});
