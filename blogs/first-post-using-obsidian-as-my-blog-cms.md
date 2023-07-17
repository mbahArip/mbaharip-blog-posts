---
title: First post! Using obsidian as my blog CMS
thumbnail: "![[dfuj8iko9ru902345.png]]"
thumbnail_x: 0.5
thumbnail_y: 0.076
tags: obsidian, github, blog, workflow
createdAt: 2023-07-16T19:33:46+07:00
updatedAt: 2023-07-18T03:18:26+07:00
---
Hello all! I finally have enough motivation to creating my own portfolio website.  
I'll use this blog as a place to practice my writing skills and improve my English. Since I'm not a native English speaker.  
For this first post, I'll explaining how I use Obsidian as my blogs CMS.

## Why Obsidian?
For the past year, I have been using couple of different note-taking apps such as **Notion**, **ClickUp**, **OneNote**, and **Obsidian**, and even tried to create my own note-taking apps for my *Study Independent* assignment called [Notekake](https://github.com/mbahArip/mini-project-notokake) (since i don't have enough motivation, so I'm not improving it).  
But I only 2 apps I use longer than a month, it is **Notion** and **Obsidian**.  
At first, I want to use notion since there already a library called `react-notion-x`, but I don't like the block editing very much.  
It is indeed look's good, but it can be too much hasle to use slash command to add things like table, links, checkbox, and anything else for me. (This is too much for me who's having slow computation brain lol)

#### That's why I Choose Obsidian.
![[img-First-post!-Using-obsidian-as-my-blog-CMS.png]]  
The main reason I love obsidian is because it's using markdown.  
Since I've always write things in markdown before I tried any note-taking apps, it feels natural for me.  
I would easily know what I need to write if i want to add table, images, checkbox, or anything else.  
And also, obsidian is open source. There also a lot of community plugins that can be used to extend obsidian.

## My Obsidian Environment
### Obsidian Plugins: A way to Supercharge Your Note-taking Apps
You can find a lot of community plugins that could help your productivity or making obsidian easier to use.  
Here are list of obsidian plugins that I use:  

| Plugins Name            | Why I use it?                                                                                                                                                                                                                                                               |
|:----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Advance table**       | This plugin help me formatting, editing, or navigating through table. I don't need to align, move, or sort it manually since there are a button that could help me do that.                                                                                                 |
| **Banners**             | This plugin will add a banner on top of the notes. I use it since it could be used for thumbnail on posts list, and also I could render it on the post page since it also give me an X and Y position offset.                                                               |
| **Clear unused images** | I'm not using it for now, but I know it will be usefull later. Since there a big chance that I'll add a attachment, then delete it. This plugins will detect unused attachment and delete it, so it doesn't stay there on your attachments folder                           |
| **Commander**           | This plugin really helpful, since it add ability to create a custom command shortcut on Obsidian UI. I'm using it to create a shortcut to do git commit and git push with a single click.                                                                                   |
| **File Hider**          | Since the notes folder I use also contains some scripts, I could easily hide it using this plugins.                                                                                                                                                                         |
| **Linter**              | Another recommended plugin from me, It could format headings, footer, paragraphs, front matter metadata, even autocorrect. I use this plugin to make sure there are no metadata missing, and also format my writing.                                                        |
| **Obsidian Git**        | As the name suggest, this plugin will add the ability to push or pull notes to github repository.                                                                                                                                                                           |
| **Paste image rename**  | By default, obsidian attachment name will be `Pasted images bla bla`. With this plugin I could set the default name of the pasted image to whatever I want.                                                                                                                 |
| **Pieces**              | Pieces is a plugin that help me to sync all my snippets between apps. I could save a code block from my browser, then use it later in my VSCode or WebStorm. It really help me if I want to insert repetative code like hooks, library client, etc.                         |
| **Templater**           | I'm using this plugin to create a default template for note posts, I make it a script so when I create a new note, it will ask me the title, and in which category I want to put it (blogs / works). Then it will create a note based on the title in blogs / works folder. | 

### Folder Structure: Keep My Vault Organized
For folder structure, I differentiate between blog and work/project posts, attachment, and index database to keep it clean.  
Here are my folder / vault structure:

| Folder / file name      | What does this folder contain?                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **.github/workflows**   | This folder contains Github Actions workflows to update indexed notes everytime I push thing into repository.                                     |
| **node_modules**\**        | I don't think I need to explain this. 🤷‍♂️                                                                                                       |
| **@attachments**        | This folder contains all attachments like pasted image, file, and banner.                                                                         |
| **@db**                 | This folder contains indexed notes* in JSON format.                                                                                               |
| **@templates**          | This folder contains `templater` notes template. I've add it into `.gitignore` since everyone should have their preffered own metadata structure. |
| **blogs**               | This folder contains all posts for my blogs. It could be a random note, explaining how I do thing, daily life, or anything.                       |
| **works**               | This folder contains all posts for my works. It will be showcasing the works / project I've done with screens, repository, or even live demo.     |
| **index-posts-data.js**\** | This file contains logic functions where it would format the posts into array of JSON. Will be executed everytime I push thing into repository.   | 
| **settings.md**         | This file contains extra settings that I'll use to update small thing on my website. Like what I'm working on, etc.                               |      

*\* I will explain what is index database later.*  
*\*\* Why don't I group this into the scripts folder? IDK* 

## First Wall of Problems: Getting the Notes
After explaining about Obsidian, now I will explaining about problems that I have while implementing this into my website.  
Before I actually implementing this, I think that I could use Octokit to fetch all the note files, then show it on the websites.  
While it actually works, there are couple problems.

If I can list the problems, it would be:
- Search notes by tags
- Sort notes by latest update
- Slow response time
- How to get attached file
- Attachments are huge

### getContents of the Notes Folder
> **Disclaimer:** The test are tested on my local machine

By fetching the notes folder, the response from `octokit` that I could use only `name`, and `path`.  
![[img-first-post-using-obsidian-as-my-blog-cms.png]]  
It looks good enough, but **I can't search by tags, or sort it** since all the metadata is inside the hashed `content` which can only be retrieved by sending a request to the file path.
##### Why Don't You Loop Every File and Get the Contents of the Note?
I've tried this inside NextJS API route. While it works, the response time are not great.  
![[img-first-post-using-obsidian-as-my-blog-cms-1.png]]

For 3 notes that I test, it took 1.5 - 2s and 4 requests sent to get all the notes inside the folder.  
Imagine if I have more than hundred of notes?  
So I scrap this logic, and trying to find new way to get all the notes, with search and sort capabilities.***

### Index All the Notes into One File
After couple of stupid ideas, I remember that Github could run a workflow on schedule, manual run, or when I push thing into the repository.  
*"Why don't I create a single file that contains all the notes with it's metadata?"* is what I'm thinking.

#### Script #1 - The Base of the Indexing Script
For the first scripts I actually just copying the previous code from API route into this JS, and output it into a JSON file.  
![[img-first-post-using-obsidian-as-my-blog-cms-2.png]]  
It still takes time, but hey.. it only happen once.  
After the JSON file created, I can fetch it with around 300 - 500ms response time, and I also can **search by tags** and **sort it by last updated**.

#### Script #2 - Improve the Speed of Indexing Script
After trying to push couple of test notes, I noticed the indexing speed would take a long long time.  
I discussed this problem with couple of my friends, and 1 of my friends told me that *I could use fs instead of `octokit`*.  
So I rewrite the indexing scripts using fs.  
![[img-first-post-using-obsidian-as-my-blog-cms-3.png]]  
And thanks to my friend, it actually improve the speed a lot.  
From 2 - 3 seconds to only 20 - 40ms.

---

With this i solve my problems regarding **searching** and **sorting.**  
So I need to find a way to get the attachment, and have it inside the post.
- ~~Search notes by tags~~
- ~~Sort notes by latest update~~
- ~~Slow response time~~
- How to get attached file
- Attachments are huge

## Breaking the Second Wall of Problems: Get the Attachments
If I could break this problems into smaller pieces, it would be:
- How get the attachments file?
- How to render it inside the post?

### Get the Attachments
There nothing special in here.  
I just get the file name, then add attachment folder into the path.  
Something like this `@attachments/[attachment name]`, then use it as path for `octokit` to fetch.

But, what if I use external links instead of attachment file?  
Easy, just add a guard to check if it contains `http` or not.  
![[img-first-post-using-obsidian-as-my-blog-cms-6.png]]

With this, I solve the problems about **how to get the attachments file**.

### But how to Render it inside the Post?
> If any of you also want to use obsidian as CMS, there are remarks extension that could parse `wikilinks`.  
> I just found out about this after I implement my own solution.

Since obsidian are using `wikilinks` tag, I need to convert this to `markdown` tag.  
My solution to this problem is by taking the markdown content, then replacing all the `wikilinks` with `markdown` tag.
```ts
import matter from 'gray-matter'

/**
* Fetch raw content logic goes here.
*/

const markdownData = matter(rawContent); // This will split the metadata and contents.
const {content, data} = markdownData;

let markdownContent = content;

// Check if there any line breaks between the content and metadata.
// Since gray matter splitting the metadata by '---', the content might have line breaks.
if(markdownContent.startsWith('\n')) {
	markdownContent = markdownContent.slice(1); 
}

// Replace all ![[fileName]] into markdown tags image
markdownContent = markdownContent.replace(
	/!\[\[([^\]]+)\]\]/g,
	'![$1](/api/attachments/$1)', // Flowchart above
);

// Replace all [[fileName]] into markdown tags url
markdownContent = markdownContent.replace(
	/\[\[([^\]]+)\]\]/g,
	'[$1](/api/attachments/$1)',
);
```
---
Now the problems with getting the attachment file is solved.  
Only one more problems to solve.
- ~~Search notes by tags~~
- ~~Sort notes by latest update~~
- ~~Slow response time~~
- ~~How to get attached file~~
- Attachments are huge

## Last Problem: Optimization
I kinda hate when I want to open an article that contains a lot of image, some of the images are not loaded yet.  
Well, I would blame my internet provider for this.  
But having optimized images on your website is not a bad idea, right?

### Trying `node-canvas`
Since it will be running on Serverless invocation, I can't use canvas.  
Some people on Github are recommending to use this library instead.

The flow are quite simple and it run smoothly on my local machine.  
![[img-first-post-using-obsidian-as-my-blog-cms-10.png]]

But when I tried to deploy it to Vercel, it throws a runtime error.  
Why? `libuuid.so.1: cannot open shared object file: No such file or directory`  
Couple people also get the same error, so i give up using this library.

### Sharp to the Rescue
With swaping the canvas to sharp, I could make the code shorter.  
I don't need to create a new canvas, draw the image, or all the hasle with resizing the image.  
Since i only need to call sharp with image buffer, inserting user query, and done.  
![[img-first-post-using-obsidian-as-my-blog-cms-11.png]]  
It work perfectly, compress + resize 993KB image to only 40KB on 1024px width and 75 webp quality.

![[img-first-post-using-obsidian-as-my-blog-cms-12.png]]  
![[img-first-post-using-obsidian-as-my-blog-cms-13.png]]

There a spike of ~100ms response time, but we can save like 90% of the bandwidth.  
Since we don't need full resolution image for thumbnail, or banner on the post page.

With this, all my problems are solved.
- ~~Search notes by tags~~
- ~~Sort notes by latest update~~
- ~~Slow response time~~
- ~~How to get attached file~~
- ~~Attachments are huge~~

## Conclusion
The reason I use **Obsidian** as my blog CMS is because it's using markdown, which I always use, and also there are a lot of community plugins that can be used to extend obsidian. I have couple of problems implementing this into my website, the problem is:
- I can't search notes by tags
- I can't sort the notes
- Slow response time
- How can I get attached file?
- Attachment size are too large

To solve the first 3 problems, I implement a Github Actions that would indexing all the notes into JSON files containing all the metadata. With this, I could search the notes by tags, sort the notes by latest update, and speed up the response time.  
For getting the attached file, I simply get the attachment name then fetch the attachment using `octokit`. But to make it actually render on the page, I need to replaceAll the `wikilinks` tag into `markdown` tag using regex.  
To compress the attachment size, I'm using `sharp` to resize the image and convert it to webp. With this I could compress the size of the image up to 90%.

---
Thank you for reading my long first post.  
Hope this post can inspire you.