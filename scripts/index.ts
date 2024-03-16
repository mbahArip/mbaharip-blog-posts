import { readFile, readdir, writeFile } from "fs/promises";
import matter from "gray-matter";
import path from "path";

const index_path = path.resolve(__dirname, "../index.json");
const index_min_path = path.resolve(__dirname, "../index.min.json");

const articles_folder = path.resolve(__dirname, "../posts/articles");
const projects_folder = path.resolve(__dirname, "../posts/projects");

type Index = {
  slug: string;
  title: string;
  summary?: string;
  type: "article" | "project";
  tags: string[];
  created_at: string;
  updated_at: string;
};
type Frontmatter = {
  title: string;
  slug: string;
  summary?: string;
  thumbnail?: string;
  thumbnail_x: number;
  thumbnail_y: number;
  tags?: string;
  created_at: string;
  updated_at: string;
  repository?: string;
  demo?: string;
};

(async () => {
  // Only get the files that end with .md
  const articles = (
    await readdir(articles_folder, {
      withFileTypes: true,
    })
  ).filter((dirent) => dirent.name.endsWith(".md"));
  const projects = (
    await readdir(projects_folder, {
      withFileTypes: true,
    })
  ).filter((dirent) => dirent.name.endsWith(".md"));
  const posts = [...articles, ...projects];

  const processed: Index[] = [];
  for (const post of posts) {
    // Read the file and parse the frontmatter
    const file = await readFile(path.resolve(post.path, post.name), "utf-8");
    const frontmatter = matter(file);
    const data = frontmatter.data as Frontmatter;
    const type = post.path.includes("articles") ? "article" : "project";

    // Add the post to the processed array
    processed.push({
      slug: data.slug,
      title: data.title,
      summary: data.summary,
      type,
      tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
  }
  // Sort the processed array by the updated_at date
  processed.sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  const json = JSON.stringify(processed, null, 2);
  const min_json = JSON.stringify(processed);

  // Write the processed array to the index.min.json file
  await Promise.all([writeFile(index_path, json, "utf-8"), writeFile(index_min_path, min_json, "utf-8")]);

  const json_size = Buffer.byteLength(json, "utf-8");
  const min_json_size = Buffer.byteLength(min_json, "utf-8");
  console.log(`index.json: ${json_size} bytes`);
  console.log(`index.min.json: ${min_json_size} bytes`);
})();
