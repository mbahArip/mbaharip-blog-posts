---
title: Using TailwindCSS with Ant-design
slug: using-tailwindcss-with-ant-design
summary: ""
thumbnail: "![[using-tailwindcss-with-antdesign.webp]]"
thumbnail_x: "0.5"
thumbnail_y: "0.5"
tags:
  - TailwindCSS
  - UI
  - Ant-Design
created_at: 2024-03-17T23:29:26+07:00
updated_at: 2024-03-18T00:01:13+07:00
---
Lately I've been using [Ant-design](https://ant.design) (will be mentioned as antd) as my UI library, but there are some problem when I tried to using it with [TailwindCSS](https://tailwindcss.com/) (will be mentioned as tailwind).
On this articles, I'll sharing how I'm using Ant-design theme with TailwindCSS.

{{ data-toc }}

## The problems
While antd fulfill most of my component needs sometime I still need to create my own component using tailwind, but it kind of annoying when I need to use colors / value from my antd theme.
From the Ant-design documentation, there actually 3 way to use antd design token :
1. Using `useToken` hooks
2. Using `getDesignToken`
3. Using CSS Variables (version 5.12.0 ++)

The problem I have with using `useToken` or `getDesignToken` is **I need to use style props** to use it, and yes I could use CSS Variable directly in `className` but I can't have any autocomplete or see the value.
(IDK if it's only me, but I really love tailwind intellisense since it's save me a lot of time)

So I decided to spend couple of hours to add antd design token inside of tailwind for my own comfort and experience while developing a web.

## The solution
This section will be separated to couple parts :
- Antd theme config
- Creating tailwind plugin
- Using it on tailwind config

:::blockquote{slot="info"}
I was thinking to publish this plugin library, but I don't have enough confidence (lol)
:::

### Antd theme config
