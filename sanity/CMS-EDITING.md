# Homepage and contact content

Run Studio with Node 22.12 or later (`npm run studio`). Deploy the updated Studio and website through the existing release process for these controls to be available on the hosted site.

Studio opens a single document for each section. Duplicate creation, unpublishing and deletion of these section documents are disabled to prevent accidentally restoring the local fallback. Remove individual items or use the visibility switches instead.

The current site content was imported on 26 October 2026: Companies We Back, What We Back and its popups, founder testimonials, FAQs, team profiles/offices, and portfolio companies. Images were uploaded to Sanity. Existing statistics, 38 news posts, and the unpublished founder draft were preserved. The founder draft remains available for review; its published counterpart contains the current website baseline.

- **Homepage — Companies We Back**: heading, description, button, company ordering, logos, logo sizes, and portfolio links. Up to six logo cells appear; additional companies rotate through those cells.
- **Homepage — What We Back & Popups**: section text, buttons, category images/titles, popup lead and description, themes, company links, and normal/white logos. Keep category IDs unique; B2B uses the existing wide card.
- **Homepage — Founders / Portfolio Partners**: edit the existing founders document. Choose **3 visible images (launch)** or **5 visible images**. Add at least that many complete founders; additional founders rotate through the same visible slots. Four entries in the three-image layout still show three images, and six entries in the five-image layout still show five. The existing portraits, active testimonial, and switching animation are retained. The default is three visible images.
- **Contact — FAQs**: heading, section label, question ordering, and rich-text answers with lists, emphasis, and links.
- **Team Page**: publish the singleton document before relying on CMS edits. Every member in Partners & IC, Founding Sponsors, Team, and Technical Advisory Committee has a **Hide from this team tab** switch. Hidden members are removed from the tab, their direct profile returns 404, and they are excluded from the sitemap.
- **Portfolio Page**: publish the singleton document before relying on CMS edits. The **Hide from portfolio page** switch controls the grid and sitemap; an unpublished or missing document uses the checked-in fallback portfolio.

Image uploads override the existing local asset paths. Drag array entries to reorder them. Publish edits to make them appear on the next page request. Drafts are excluded. Missing section documents, missing configuration, and request failures use the checked-in fallback. A successfully fetched published collection is authoritative: empty collections stay empty, removed entries stay removed, and cleared optional fields are not restored from local content. Invalid individual entries are omitted. If legacy duplicate section documents exist, the most recently updated published document is used.

The website routes that consume Sanity are dynamically rendered with uncached published queries. A published edit appears on the next production request without rebuilding the website. Draft edits remain private until **Publish** is clicked.

Team profile company cards use the published portfolio. Changes to profile slugs are used by directory links and the sitemap. Founder logo uploads and portfolio sectors are no longer overridden by company-specific code.

Run `npm run cms:import` for a read-only import preview. Run `CMS_IMPORT_APPLY=1 npm run cms:import` to publish missing section documents and upload their images using the signed-in Sanity CLI account. Existing published documents and drafts are preserved; backups are written to the ignored `.cms-backups/` folder. Do not commit these backups. `npm run cms:audit` compares the reference website against the checked-in baseline; set `CMS_AUDIT_ORIGIN` to check a different origin. After editorial changes, baseline differences are expected.

Release: push the website code through the existing Vercel deployment, and deploy the updated Studio with `npx sanity deploy` (or the existing Studio hosting workflow). Both use project `9tvsfb8e`, dataset `production`. The dataset import is already live; the code fixes and new Studio controls take effect after their deployments. Subsequent content-only publishes require neither a rebuild nor a webhook.

Verification: `npm run lint`, `npm run build`, `npm run studio:build`, `npm run test:cms`, and `node --experimental-strip-types --test scripts/homepage-founders.test.mjs` (Node 22.12+).

Handover notes (26 October 2026): the import and a reversible published-edit check passed against both the local production build and the live Vercel homepage; original text was restored. All imported published section documents passed schema validation. Two existing records need editorial review: the preserved founder draft is incomplete (missing heading and fewer than three founders), and news post `legacy-news-baf9a9265284421167a6e2cb` has a link in `body[block44].markDefs[link4].href` that fails the allowed-URL-scheme validation. These existing editorial values were preserved. In Studio, discard the incomplete founder draft if it is no longer needed to return to the fully populated published baseline, or complete it before publishing.
