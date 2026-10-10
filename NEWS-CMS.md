# News & Insights content

The 38 posts from all seven pages of the original `/news` archive are stored as published `blogPost` documents in Sanity. Original image files were uploaded without resizing or recompression. The source snapshot is `content/news-archive.json`.

## Editing

Open **Blog Posts** in Sanity, edit or create a post, then **Publish**. The homepage news cards, `/news`, article pages, related stories, article metadata and sitemap read published CMS data on each server request. Drafts are excluded. Publishing does not need a Vercel rebuild or webhook; refresh the page to see an update. Deleting or unpublishing a post removes it from successful CMS responses.

Five legacy entries have no category on the source site. They remain uncategorised, visible under All. Editors can assign a category later.

## Deployment

Deploy this website revision to Vercel using the existing `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` variables. The current dataset is publicly readable; no browser token is needed. A private dataset would require a server-only `SANITY_API_READ_TOKEN`.

Deploy the updated Studio with `npx sanity deploy` so editors can edit the newly supported podcast players and image links. Standard blog text, dates, images and categories use the existing schema fields.

## Migration / verification

Use Node 22.12+ and the existing Sanity CLI login:

```sh
NEWS_IMPORT_DRY_RUN=1 npm run news:import
npm run news:import
npm run news:verify
npm run test:news
```

The import is additive and skips matching slugs or stable migration IDs, including drafts; it never overwrites editorial changes. Verification compares migrated posts with the original snapshot, so intentional later CMS edits can produce differences.

If CMS configuration is absent or a CMS request fails, the website serves the source archive as a fallback. A successful empty CMS response stays empty, so deleted content does not reappear. During an outage, the fallback snapshot may not include subsequent editorial changes.

The old `/media/...` URLs redirect to their matching `/news/...` articles. Existing short URLs such as `/news/fund-four` remain unchanged.
