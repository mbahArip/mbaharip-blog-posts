---
title: Next.js Google Drive Index
slug: nextjs-google-drive-index
summary: Google Drive index built with Next.js for easier sharing files to public
thumbnail: "![[nextjs-google-drive-index.png]]"
thumbnail_x: "0.5"
thumbnail_y: "0.5"
tags:
  - Nextjs
  - Typescript
  - Index
created_at: 2024-03-16T19:56:00+07:00
updated_at: 2024-03-16T21:04:12+07:00
repository: https://github.com/mbahArip/next-gdrive-index
demo: https://drive-demo.mbaharip.com/
---
`next-gdrive-index` is an indexer for Google Drive, it's a simple project that I made to share my files in Google Drive.  
It's aim to simplify the process of sharing files using Google Drive, and also implements some features that I think is useful for sharing files.

:::blockquote{slot="info"}  
This project are **Heavily Inspired** by [onedrive-vercel-index](https://github.com/spencerwooo/onedrive-vercel-index) by [SpencerWooo](https://github.com/spencerwooo)  
:::

## Why I Made This?
I know there's already couple project to create Google Drive index, such as [goindex](https://github.com/alx-xlx/goindex). It was built on Cloudflare Workers and Vue, which I don't have much experience. And it was pretty slow when the files are nested deep into folder. (At first I thought it was Cloudflare fault, after implementing my own I found out it was Google Drive problem)  
So I decided to create my own Google Drive index using technology I'm more familiar with. **Next.js** and deployed on **Vercel**.

> *"Why don't use Onedrive instead?"*

When I compare the price between these two services, Google Drive is cheaper than Onedrive.  
For 100GB plan, Google Drive price at IDR 269.000 / ~$18 USD annually, meanwhile Onedrive at IDR 319.000 / ~$21 USD annually.  
Even if I don't want to spend any money, Google Drive offering 15GB of storage, and Onedrive only offering 5GB.

I know there are a lot of people selling cheap `.edu` account for Google Drive and Onedrive, but most of the time those account doesn't last long, especially Google Drive account.  
So I want to do it without buying cheap `.edu` account or anything similar.
## Features
- **Private Index**, Lock the whole site with a password
- **Folder and file protection**, You can add password to a folder
- **Readme file**, Add a note / readme to a folder
- **File preview**, Preview files directly on the site. Supported files:
	- Image (only format supported by the browser)
	- Video (only format supported by the browser)
	- Audio (only format supported by the browser)
	- Markdown
	- PDF
	- Document (docx, pptx, xlsx)
	- Code
	- Text
	- Manga (cbz)
- **File search**, Find your folders / files easily
- **Raw file link**, Use the index to host assets for your website or embed it on forums
## Security
All files that will be shown, **Need to be Shared** with `Anyone with the link can view` permission.  
This is because Google Drive API can only access files that are shared with this permission.

But, every files `id` and `webContentLink` are encrypted with `AES-256-CBC` using your own key, so no one can view the `id` / `webContentLink` of your files without the correct key.  
Except, if the files are larger than the `fileSizeLimit` (default is 4MB for Vercel), then the `webContentLink` will be used as download link.
## Known Issues
### File Size Limit
File size limit causing some files can't be previewed, and the download will be redirected to the raw file link.  
The file size limit can be changed on config file.
### Long Response Time
The flow of the data fetching is like this:  
![App flow](nextjs-google-drive-index-1.png)  
The app will checking for each path to validate if the path is valid.  
Example, if user trying to access `/folder A/folder B/folder C/some-files.png`  
It will check if:
1. `some-files.png` is actually inside `folder C`
2. `folder C` is actually inside `folder B`
3. `folder B` is actually inside `folder A`  
So the deeper the nested folder, the longer the check process.

At the moment, it roughly take around 600 - 2 seconds to access nested files on my Google Drive.  
To improve the response time, I've added cache to the response so the next time you trying to access the same path it *hopefully* will be faster.  
You can change how long the cache on config file.
### Shared Drive is ~~not~~ now Supported
~~I don't have Shared Google Drive, so I can't test it and or implement it.~~  
Implemented by [@loadingthedev](https://github.com/mbahArip/next-gdrive-index/pull/4)
### No Support for Google Docs, Sheets, or Slides
For now, I don't have any plan to implement this.  
All Google Drive files like Docs, Sheets, and Slides are hidden from the list.  
PR are welcome though~ ;)