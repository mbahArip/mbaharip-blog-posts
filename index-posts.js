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

      const data = parsePostData(content);
      const slug = parseWorkFileName(file.name);

      return {
        title: data.metadata.title,
        description: data.metadata.description,
        created: data.metadata.created,
        updated: data.metadata.updated,
        banner: data.metadata.banner,
        tags: data.metadata.tags,
        path: slug,
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

      if(!content) return;

      const data = parsePostData(content);
      const slug = parseBlogFileName(file.name);

      return {
        title: data.metadata.title,
        description: data.metadata.description,
        created: data.metadata.created,
        updated: data.metadata.updated,
        banner: data.metadata.banner,
        tags: data.metadata.tags,
        path: slug,
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

function parsePostData(data) {
  let markdown = Buffer.from(data.content, 'base64').toString('utf-8');
  const frontMatter = markdown.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';
  markdown = markdown.replace(/^---\n([\s\S]*?)\n---\n/, '');

  const rawFm = frontMatter
    .split('\n')
    .map((line) => line.split(': '))
    .reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: value,
      };
    }, {});

  const fm = {
    title: rawFm.title ?? '',
    description: processDescription(markdown ?? ''),
    banner: processBanner(rawFm.banner ?? ''),
    tags: processTags(rawFm.tags ?? ''),
    created: new Date(rawFm.created),
    updated: new Date(rawFm.updated),
  };

  return {
    content: markdown,
    metadata: fm,
  };
}

function processDescription(markdown) {
  const DESC_LENGTH = 150;

  return markdown
    .replace(/!\[\[([^\]]+)\]\]/g, '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/#+\s/g, '')
    .replace(/\n/g, ' ')
    .substring(0, DESC_LENGTH)
    .trim()
    .concat(markdown.length > DESC_LENGTH ? '...' : '');
}
function processBanner(fmBanner) {
  if (!fmBanner) return '/api/attachments/no-banner.webp';
  let url = '';
  if (/!\[\[([^\]]+)\]\]/g.test(fmBanner)) {
    url = fmBanner.match(/!\[\[([^\]]+)\]\]/)?.[1] ?? 'logo.webp';
    url = `/api/attachments/banner/${url}`;
  } else {
    url = fmBanner.replace(/"/g, '').replace(/\\/g, '');
  }

  return url;
}
function processTags(fmTags) {
  if (!fmTags) return [];
  return fmTags.split(' ').map((tag) => tag.trim());
}


run().catch((error) => {
  console.error(error);
  process.exit(1);
});