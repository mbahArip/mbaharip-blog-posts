const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const moment = require('moment');
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit();
const owner = 'mbaharip'
const repo = 'mbaharip-blog-posts';

async function run() {
  const { data } = await octokit.rest.repos.getContent({
    owner: owner,
    repo: repo,
    path: 'posts',
  });

  const posts = await Promise.all(
    data.map(async (file) => {
      if (file.type !== 'file') return null;

      const content = await octokit.rest.repos.getContent({
        owner: owner,
        repo: repo,
        path: file.path,
      });

      const { data: frontmatter } = matter(content.data);

      return {
        title: frontmatter.title,
        created: frontmatter.created,
        updated: frontmatter.updated,
        banner: frontmatter.banner ?? "",
        tags: frontmatter.tags ?? "",
        path: parseBlogFileName(file.name),
      };
    })
  );

  const { data: works } = await octokit.rest.repos.getContent({
    owner: owner,
    repo: repo,
    path: 'works',
  });

  const worksList = await Promise.all(
    works.map(async (file) => {
      if (file.type !== 'file') return null;

      const content = await octokit.rest.repos.getContent({
        owner: owner,
        repo: repo,
        path: file.path,
      });

      const { data: frontmatter } = matter(content.data);

      return {
        title: frontmatter.title,
        created: frontmatter.created,
        updated: frontmatter.updated,
        banner: frontmatter.banner,
        tags: frontmatter.tags,
        path: parseWorkFileName(file.name),
      };
    })
  );

  const dataPosts = JSON.stringify(posts, null, 2);
  const dataWorks = JSON.stringify(worksList, null, 2);

  const postsIndexPath = path.resolve(__dirname, './@db/postsIndex.json')
  const worksIndexPath = path.resolve(__dirname, './@db/worksIndex.json')
  fs.writeFileSync(postsIndexPath, dataPosts);
  fs.writeFileSync(worksIndexPath, dataWorks);

}

function parseBlogFileName(name) {
  // 2023-07-09_21-03-59__first-post.md
  const [timedate, fileName] = name.split('__');

  // Format time
  const [date, time] = timedate.split('_');
  const [year, month, day] = date.split('-');
  const [hour, minute, second] = time.split('-');
  const timestamp = new Date(
    `${month}/${day}/${year} ${hour}:${minute}:${second}`,
  ).getTime();

  // Format name
  const file = fileName.split('.')[0];
  const postName = fileName
    .split('-')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .replace('.md', '');

  // Format url slug | /:date/:time/:file
  const slug = `/blogs/${year}/${month}/${day}/${hour}${minute}${second}_${file}`;
  return slug;
}
function parseWorkFileName(name){
    const slug = `/works/${name}`
    return slug
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});