---
title: First post! Using obsidian as my blog CMS
thumbnail: 
thumbnail_x: 0.5
thumbnail_y: 0.5
tags:
  - 
createdAt: 2023-07-16T19:33:46+07:00
updatedAt: 2023-07-16T23:45:08+07:00
---
Hello all! I finally have enough motivation to creating my own portfolio website.
I'll use this blog as a place to practice my writing skills and improve my English. Since I'm not a native English speaker.

For this first post, I'll explaining how I use Obsidian as my blogs CMS.

## Table of Contents

## Why Obsidian?
For the past year, I have been using couple of different note-taking apps such as **Notion**, **ClickUp**, **OneNote**, and **Obsidian**. I even tried to create my own note-taking apps for my Study Independent assignment called [Notekake](https://github.com/mbahArip/mini-project-notokake), but I don't have enough motivation to improving it.

At first, I want to use notion since there already a library called `react-notion-x` but i don't like block based editing that notion use, so i decide i will use obsidian instead.

## Obsidian Environment
### Obsidian Plugins
One of many reason i choose obsidian is because it's extendability, you can find a lot of community plugins that could help your productivity or making it's easier to use.

Here are list of obsidian plugins that i use:
- **Advance table**, I use it to format the tables if I need one.
- **Banners**, this plugin add banners to top of the notes, and I use it for thumbnail of the notes.
- **Clear unused images**, delete all unused images with a single click.
- **Commander**, this plugin can create a custom command, I use it for adding git push and pull command.
- **File Hider**, since the vault or notes folder also contains script for indexing (I'll explain it later), I use this plugin to hide node_modules folder.
- **Linter**, I use this plugin to making sure all the front matter metadata is there, also update the last update time when I save the notes.
- **Obsidian Git**, as the name suggest, I use this to push and pull the notes into github repository. I set it automatically push every 30 minutes, and pull every 1 hour in case i forgot to push the new notes into repository.
- **Paste image rename**, the plugin will add ability to rename the image I added to the notes.
- **Pieces**, a snippets manager, I've been using it for couple months and it help me to create a repeated code like `prisma client` whenever I create a new project.
- **Templater**, I'm using this one to create a dialog whenever I want to create a new note, it will ask me what the title and is it a blog or project, then it will create a new note based on the title on respective folder.

### Folder / Vault structure
For folder structure, I differentiate between blog and work/project posts.
Here are my folder / vault structure:
- **@attachments**, this folder will contains all the attachment used on notes.
- **@db**, this folder will contains indexed notes (I'll explain it later).
- **@templates**, contains template that will be used by Templater plugin.
- **blogs**, contains all notes that will show up on `/blogs` page.
- **works**, contains all notes that will show up on `/works` page.
- **settings.md**, extra settings that contains thing on web that I want to change easily.



## Into code!
### Fetching the notes
So I've my obsidian environment ready, and I need to think how can I get these notes content into my website. The answer is... **Octokit**! Github SDK that I can use to get contents from my posts repository.

At first, this is the flow I can think of.
![[First-post!-Using-obsidian-as-my-blog-CMS.png]]
But after trying to implement it, it doesn't good enough for me since it's slow, consume too many request to octokit, and I can't sort it. It will sorted by the file name.
At first I think i would use naming format like `YYYY-MM-DD_HH-mm-ss__filename.md` which is doesn't look good, and it still doesn't fix the time and request problem.
So i think about why don't I index the whole notes?

### Indexing notes
"Doesn't it still consume lot request?", "Won't the indexing slowing down the request?" is what I'm asking myself.
Then I remember that Github provide Actions where it can update a file inside repository. (NOTE: I never use Github Actions before, so at the moment I don't know if it would work or not)

I create a simple js script that fetch all the notes and put it inside a single JSON using octokit, then set the Action to run the script everytime I push commit into the repository.
And yeah, it still slow since I'm using octokit where it fetch data into github API.
Then i think, why don't i use `fs` for read the files? since Actions could run the scripts that needed node modules, doesn't that means it could read files inside the repository it run?
I rework the scripts to read the notes using `fs` instead, and yeah it work like a charm.
From 1 - 3 seconds everytime I run the script, it goes to 15ms - 30ms.

Now the problem with getting all the files with it's metadata is solved.
It's fast, it's only consume 1 request to octokit, and I could sort and search the notes based on it's file name, or tags.
### Implementing into website
After implementing index for notes, now I can create API route to fetch the posts.

On the API route, I also implement `keyword`, `page`, and `perPage` query.
Where the `keyword` would filter the indexed file name and tags, and `page` with `perPage` would create pagination for the notes.
Then return the response with the posts data, doesn't forget to also add `Cache-Control` header to response.

On the `/blogs` and `/works` page, I just need to fetch the posts, then show it.




I think that's it. If you want to see the whole process, you can check posts [repository](https://github.com/mbahArip/mbaharip-blog-posts/).
Thank you for reading! I hope you like my first posts.

See you on the next one!