```dataview
TABLE title as PostTitle, banner as PostBanner, tags as PostTags, created as createdAt, updated as updatedAt
FROM "posts"
SORT updated DESC
```