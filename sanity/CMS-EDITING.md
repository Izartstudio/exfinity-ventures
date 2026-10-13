# Homepage and contact content

Run Studio with Node 22.12 or later (`npm run studio`). Deploy the updated Studio and website through the existing release process for these controls to be available on the hosted site.

Create one document for each new section. New documents start with the site's current content:

- **Homepage — Companies We Back**: heading, description, button, company ordering, logos, logo sizes, and portfolio links. Up to six logo cells appear; additional companies rotate through those cells.
- **Homepage — What We Back & Popups**: section text, buttons, category images/titles, popup lead and description, themes, company links, and normal/white logos. Keep category IDs unique; B2B uses the existing wide card.
- **Homepage — Founders / Portfolio Partners**: edit the existing founders document. Choose **3 visible images (launch)** or **5 visible images**. Add at least that many complete founders; additional founders rotate through the same visible slots. Four entries in the three-image layout still show three images, and six entries in the five-image layout still show five. The existing portraits, active testimonial, and switching animation are retained. The default is three visible images.
- **Contact — FAQs**: heading, section label, question ordering, and rich-text answers with lists, emphasis, and links.
- **Team Page**: publish the singleton document before relying on CMS edits. Every member in Partners & IC, Founding Sponsors, Team, and Technical Advisory Committee has a **Hide from this team tab** switch. Hidden members are removed from the tab, their direct profile returns 404, and they are excluded from the sitemap.
- **Portfolio Page**: publish the singleton document before relying on CMS edits. The **Hide from portfolio page** switch controls the grid and sitemap; an unpublished or missing document uses the checked-in fallback portfolio.

Image uploads override the existing local asset paths. Drag array entries to reorder them. Publish edits to make them appear on the next page request. Drafts are excluded. Existing site content remains the fallback until valid section content is published or if Sanity is unavailable. If duplicate section documents exist, the most recently updated published document is used.

The website routes that consume Sanity are dynamically rendered with uncached published queries. A published edit appears on the next production request without rebuilding the website. Draft edits remain private until **Publish** is clicked.

Verification: `npm run lint`, `npm run build`, `npm run studio:build`, and `node --experimental-strip-types --test scripts/homepage-founders.test.mjs` (Node 22.12+).
