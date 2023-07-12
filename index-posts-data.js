const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const moment = require("moment");
const { Octokit } = require("@octokit/rest");

// Doesn't need API token since I only run this every hour.
// May need to add token if I want to run this more often.
// ! Remove token before commit
const token = "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";
const octokit = new Octokit({
  auth: token,
});
const owner = "mbaharip";
const repo = "mbaharip-blog-posts";

async function run() {
  const fetchBlogs = octokit.rest.repos.getContent({
    owner,
    repo,
    path: "posts",
  });
  const fetchWorks = octokit.rest.repos.getContent({
    owner,
    repo,
    path: "works",
  });

  const [blogsData, worksData] = await Promise.all([
    fetchBlogs,
    fetchWorks,
  ]).then(([blogs, works]) => {
    return [blogs.data, works.data];
  });

  const processBlogs = Promise.all(
    blogsData.map(async (file) => {
      if (file.type !== "file") return null;

      const { data: fileData } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: file.path,
      });

      const data = Buffer.from(fileData.content, "base64").toString("utf8");
      const markdownData = matter(data);
      let markdownContent = markdownData.content;
      // check if markdownContent start with \n, if yes remove the first line break
      if (markdownContent.startsWith("\n")) {
        markdownContent = markdownContent.slice(1);
      }

      const summary = markdownContent
        .replace(/!\[\[([^\]]+)\]\]/g, "")
        .replace(/<[^>]*>?/gm, "")
        .replace(/#+\s/g, "")
        .split("\n")
        .slice(0, 3)
        .join(" ")
        .trim();

      return {
        title: markdownData.data.title,
        summary,
        createdAt:
          markdownData.data.createdAt ??
          moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ"),
        updatedAt:
          markdownData.data.updatedAt ??
          moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ"),
        thumbnail: markdownData.data.thumbnail ?? null,
        thumbnail_y: markdownData.data.thumbnail_y ?? 0.5,
        thumbnail_x: markdownData.data.thumbnail_x ?? 0.5,
        tags: markdownData.data.tags ?? [],
        path: file.name.replace(".md", ""),
      };
    })
  );

  console.log(await processBlogs);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
