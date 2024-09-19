---
title: UseURLState - Persist your state on URL
slug: useurlstate-persist-your-state-on-url
summary: ""
thumbnail: ""
thumbnail_x: ""
thumbnail_y: ""
tags: 
created_at: 2024-09-19T16:05:03+07:00
updated_at: 2024-09-19T16:50:03+07:00
---

Saving state in URL is a common practice in web development, there a lot of benefits of doing so, such as sharing the state with others, bookmarking the page with the state, and more.  
This practice is especially useful to save the state of a filter, pagination, or any other state that can be represented as a query parameter.  
Usually, you can find this practice in e-commerce websites, where you can share the product list with a specific filter.

## My Reasoning

While I'm working on a CMS project, I want to save the filter and pagination state in the URL.  
When it's only 1 or 2 pages, it's still easy to remember what kind of filter that can be used. But when it's a lot of pages, it's hard to remember what kind of filter can be used for each page, and I need to recheck the schema of the files again and again.

To make it easier for me (and probably for others), I decided to create a custom hook with Zod validation to make sure the state is correct, and also add autocomplete to make it easier to use.

You can follow this article to see how I do it, or go to the **Result section** to copy the hooks.

{{ data-toc }}

## Code Time
### Initial Hook File
First we need to create our base hook file on `/src/hooks` folder, you are free to name the hook whatever you want but I will name it `useURLState`.
The path should be `/src/hooks/useURLState.tsx` now.

```tsx
"use client";

export default function useURLState() {

	return []
}
```

## Conclusion