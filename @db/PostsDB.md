```dataview
LIST title as PostTitle, banner as PostBanner, tags as PostTags, created as createdAt, updated as updatedAt
FROM "posts"
SORT updatedAt DESC
```