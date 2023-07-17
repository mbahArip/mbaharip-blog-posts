---
title: First post! Using obsidian as my blog CMS
thumbnail: "![[dfuj8iko9ru902345.png]]"
thumbnail_x: 0.5
thumbnail_y: 0.524
tags: obsidian, github, blog, workflow
createdAt: 2023-07-16T19:33:46+07:00
updatedAt: 2023-07-18T01:45:08+07:00
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

## First wall of problems: Getting the notes
After explaining about Obsidian, now I will explaining about problems that I have while implementing this into my website.
Before I actually implementing this, I think that I could use Octokit to fetch all the note files, then show it on the websites.
While it actually works, there are couple problems.

If I can list the problems, it would be:
- Search notes by tags
- Sort notes by latest update
- Slow response time
- How to get attached file
- Attachments are huge

### getContents of the notes folder
> **Disclaimer:** The test are tested on my local machine

By fetching the notes folder, the response from `octokit` that I could use only `name`, and `path`.
![[img-first-post-using-obsidian-as-my-blog-cms.png]]
It looks good enough, but **I can't search by tags, or sort it** since all the metadata is inside the hashed `content` which can only be retrieved by sending a request to the file path.
##### Why don't you loop every file and get the contents of the note?
I've tried this inside NextJS API route. While it works, the response time are not great.
![[img-first-post-using-obsidian-as-my-blog-cms-1.png]]

For 3 notes that I test, it took 1.5 - 2s and 4 requests sent to get all the notes inside the folder.
Imagine if I have more than hundred of notes?
So I scrap this logic, and trying to find new way to get all the notes, with search and sort capabilities.***

### Index all the notes into one file
After couple of stupid ideas, I remember that Github could run a workflow on schedule, manual run, or when I push thing into the repository.
*"Why don't I create a single file that contains all the notes with it's metadata?"* is what I'm thinking.

#### Script #1 - The base of the indexing script
For the first scripts I actually just copying the previous code from API route into this JS, and output it into a JSON file.
![[img-first-post-using-obsidian-as-my-blog-cms-2.png]]
It still takes time, but hey.. it only happen once.
After the JSON file created, I can fetch it with around 300 - 500ms response time, and I also can **search by tags** and **sort it by last updated**.

#### Script #2 - Improve the speed of indexing script
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

## Breaking the second wall of problems: Get the attachments
If you think about it, it would be easy.
I could just get the file name, then add the folder name.
Something like this `https://api.github.com/`

## Into Code!
### Fetching the Notes
So I've my obsidian environment ready, and I need to think how can I get these notes content into my website. The answer is… **Octokit**! Github SDK that I can use to get contents from my posts repository.

At first, this is the flow I can think of.  
![[First-post!-Using-obsidian-as-my-blog-CMS.png]]  
But after trying to implement it, it doesn't good enough for me since it's slow, consume too many request to octokit, and I can't sort it. It will sorted by the file name.  
At first I think i would use naming format like `YYYY-MM-DD_HH-mm-ss__filename.md` which is doesn't look good, and it still doesn't fix the time and request problem.  
So i think about why don't I index the whole notes?

### Indexing Notes
"Doesn't it still consume lot request?", "Won't the indexing slowing down the request?" is what I'm asking myself.  
Then I remember that Github provide Actions where it can update a file inside repository. (NOTE: I never use Github Actions before, so at the moment I don't know if it would work or not)

I create a simple js script that fetch all the notes and put it inside a single JSON using octokit, then set the Action to run the script everytime I push commit into the repository.  
And yeah, it still slow since I'm using octokit where it fetch data into github API.  
Then i think, why don't i use `fs` for read the files? since Actions could run the scripts that needed node modules, doesn't that means it could read files inside the repository it run?  
I rework the scripts to read the notes using `fs` instead, and yeah it work like a charm.  
From 1 - 3 seconds everytime I run the script, it goes to 15ms - 30ms.

Now the problem with getting all the files with it's metadata is solved.  
It's fast, it's only consume 1 request to octokit, and I could sort and search the notes based on it's file name, or tags.
### Implementing into Website
After implementing index for notes, now I can create API route to fetch the posts.

On the API route, I also implement `keyword`, `page`, and `perPage` query.  
Where the `keyword` would filter the indexed file name and tags, and `page` with `perPage` would create pagination for the notes.  
Then return the response with the posts data, doesn't forget to also add `Cache-Control` header to response.

On the `/blogs` and `/works` page, I just need to fetch the posts, then show it.



---

I think that's it. If you want to see the whole process, you can check posts [repository](https://github.com/mbahArip/mbaharip-blog-posts/).  
Thank you for reading! I hope you like my first posts.

See you on the next one!