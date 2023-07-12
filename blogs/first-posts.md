---
title: First posts
thumbnail: "![[630704bf8fd458a5a1b71fc3_thumb.webp]]"
thumbnail_x: 0.5
thumbnail_y: 0.5
tags:
  - 
createdAt: 2023-07-12T16:12:29+07:00
updatedAt: 2023-07-12T17:37:04+07:00
---
![[logo.svg]]
Finally I can implement my own blog using NextJS, Github, and Obsidian.
I'm using NextJS as the framework for this website, Github for storing all of the blog posts, and Obsidian as editor for the blogs.

I simply create a API route in nextjs to my github repository, and returning all the contents inside the repository and also paginating all the data inside the API routes (since github doesn't have pagination for getContents), and for my blog posts are automatically pushed into the repository using `Obsidian Git` plugin. This plugin really help if you want to sync your notes between devices.

`Why don't use Notion and React-Notion-X?`
I love notion, but notion are too complex for me, there are too many blocks.
I love obsidian simplicity and extendibility, since it's basically a markdown notes without extra fancy thing.
That's why I choose obsidian instead of notion.