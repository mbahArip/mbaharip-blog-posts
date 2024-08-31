---
title: Next.js Google Drive Index
slug: nextjs-google-drive-index
summary: Google Drive index built with Next.js for easier sharing files to public
thumbnail: "![[nextjs-google-drive-index.webp]]"
thumbnail_x: "0.5"
thumbnail_y: "0.5"
tags: Nextjs, Typescript, Index
created_at: 2024-03-16T19:56:00+07:00
updated_at: 2024-08-31T12:16:19+07:00
repository: https://github.com/mbahArip/next-gdrive-index
demo: https://drive-demo.mbaharip.com/
---
`next-gdrive-index` is a Google Drive directory index. The aim of this project is to simplify the process of sharing files using Google Drive, and also add some features that *I think* is useful when sharing files.

> This project are **Heavily Inspired** by [onedrive-vercel-index](https://github.com/spencerwooo/onedrive-vercel-index) by [SpencerWooo](https://github.com/spencerwooo)  

## Why I Made This?

> **TLDR;**  
> It is cheaper to use Google Drive than other similar service

There are a lot cloud storage service like Onedrive, Dropbox, Mega, etc.  
But, between all those service, I think Google Drive is a lot cheaper than others (at least in my region).

Here are the pricing comparison between free and cheapest plan  
*Price are converted to IDR, since it's easier for me to compare this using my own currency*

| Service          | Free plan       | Paid plan | Price                  | Price to Storage                            | Transfer Quota |
| :--------------- | :-------------- | :-------- | :--------------------- | :------------------------------------------ | :------------: |
| **Google Drive** | 15GB            | 2TB       | 135k IDR<br>~112k IDR  | <u>14.8GB / 1k / mo<br>17.8GB / 1k / yr</u> |  **<u>X</u>**  |
| **Onedrive**\*\* | 5GB             | 1TB       | 96k IDR<br>80k IDR     | 10.4GB / 1k / mo<br>12.5GB / 1k / yr        |  **<u>X</u>**  |
| **Dropbox**\*    | 2GB             | 2TB       | ~191k IDR<br>~159k IDR | 10.5GB / 1k / mo<br>12.5GB / 1k / yr        |       O        |
| **MEGA**         | **<u>20GB</u>** | 2TB       | ~174k IDR<br>~145k IDR | 11.5GB / 1k / mo<br>13.8GB / 1k / yr        |       O        |

\* Price are in USD, and there are no regional price for IDR  
\*\* There are no 2TB plan

By using this data, I picked Google Drive instead other service.  
I know there are a lot of people selling cheap education account especially for Google Drive and Onedrive, but most of the time <u>those account doesn't last long</u>.

## Features
- **Private Index**, protect the whole site with a password
- **Folder and file protection**, protect certain path with a password
- **Readme file**, add description (or whatever) inside a readme to be rendered when you open the folder
- **File preview**, preview the file before download ( Preview file size limit can be adjusted )
  - Image preview
  - Video preview
  - Audio preview
  - Document preview
  - Code / Text / Markdown preview
  - Manga preview (cbz)
- **File search**, search by the file or folder name
- **Direct download**, download directly via API route instead of google drive link ( Size limit can be adjusted )
- **Raw file link**, embed your media files
- **Light/Dark mode**, choose your side!
- **Customizable Theme**, we are using `shadcn/ui` now! you can customize your site [via configuration page](https://drive-demo.mbaharip.com/deploy#theme)
- **Links**, add social, or information link on the navbar
- **Sponsors**, using this for thing for community? add a sponsor / donate button on your navbar!

## Known Issues
### File Size Limit
> This only apply if `maxFileSize` is enabled / more than 0

You need to set the file sharing permission to `Anyone with the link can view` on the root folder.

**Why?**  
The download link will be redirected if the file you're trying to download is bigger than the `maxFileSize`, and most of platform are limiting the response body size (ex: Vercel limit is 4MB).  
If you don't set the permission, people can't access or download the file.

This will <u>expose the file ID</u>, and people can access the file directly from Google Drive.  
But it <u>only apply to the file</u>, and they can't see or browse the folder directly from Google Drive.
### No Support for Google Docs, Sheets, and Slides
For now, I don't have any plan to implement this because I'm not using it.  
If you think you can implement it, feel free to create a PR! ;)
### ~~Can't Seek on Audio and Video preview~~
~~It looks like you can't seek the audio and video preview, so you need to listen / watch from the beginning.~~  
Fixed on v2.0.2
### ~~Shared Drive is not supported~~
~~I don't have Shared Drive, so I can't test it and implement it~~  
Implemented by [@loadingthedev](https://github.com/loadingthedev) [(PR #4)](https://github.com/mbahArip/next-gdrive-index/pull/4)
### Not Supporting File / Folder Shortcut
Google Drive will give different ID for the shortcut and the actual target itself.  
Might need to change the way I fetch files to support this

## Things Might Be Implemented
Here are things that I want, and might be implemented on the future
### Internationalization / i18n
It should be a good idea to have the site and deploying guide with multiple language support.
### Multiple Drive
It's either from multiple Google Drive account with multiple Service Account, or a basic single Google Drive account with multiple root start point either in their own Drive or Shared Drive
### Authentication
Probably a good feature if you are a content creator that only want the one who subscribed to you get the files.  
It might need a database, but idk if I can implement it without the need of database