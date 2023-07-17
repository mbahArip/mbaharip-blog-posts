---
title: First post! Using obsidian as my blog CMS
thumbnail: "![[dfuj8iko9ru902345.png]]"
thumbnail_x: 0.5
thumbnail_y: 0.524
tags: obsidian, github, blog, workflow
createdAt: 2023-07-16T19:33:46+07:00
updatedAt: 2023-07-17T23:45:03+07:00
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

### Folder Structure: Keep my vault organized
For folder structure, I differentiate between blog and work/project posts, attachment, and index database to keep it clean.  
Here are my folder / vault structure:

| Folder name      | What does this folder contain?                                            |
| ---------------- | ------------------------------------------------------------------------- |
| **@attachments** | This folder contains all attachments like pasted image, file, and banner. |
| **@db**          | This folder contains indexed notes in JSON                                                                          |
- **@attachments**, this folder will contains all the attachment used on notes.
- **@db**, this folder will contains indexed notes (I'll explain it later).
- **@templates**, contains template that will be used by Templater plugin.
- **blogs**, contains all notes that will show up on `/blogs` page.
- **works**, contains all notes that will show up on `/works` page.
- **settings.md**, extra settings that contains thing on web that I want to change easily.

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