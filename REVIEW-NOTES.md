# Ajitate review draft

Local preview: http://127.0.0.1:5173/Ajitate/

This is a local review draft. Nothing has been pushed or published.

## Sergio's recovery point

- Original repository: https://github.com/colab-websites/Ajitate
- Exact starting commit: `3dba94db6a2b26313806fefaf3cbd60a426d26e9`
- Local backup tag: `backup/sergio-2026-09-05`
- Verified full-history archive: `backups/Ajitate-sergio-2026-09-05.bundle`
- Draft branch: `draft/ajitate-site-fixes`

The backup folder is excluded from Git. Copy the bundle to another drive if desired. To inspect the original without changing this draft, create a separate checkout:

```sh
git worktree add ../Ajitate-sergio-original backup/sergio-2026-09-05
```

Or recover from the standalone bundle in a new folder:

```sh
git clone backups/Ajitate-sergio-2026-09-05.bundle ../Ajitate-recovered
```

No reset or force push is needed. If changes are eventually published, a normal revert commit can roll them back while preserving history.

## Changes

- Kept Ajitate branding and Sergio's exact original Cloudinary hero video.
- Replaced the fixed scaled hero layout with a responsive layout; added video pause/play and reduced-motion handling.
- Connected navigation to sections and added a mobile navigation menu.
- Added menu category filters and dish-specific inquiry dialogs.
- Made unknown menu, prices, photos, promotions, hours, address and ordering information explicit placeholders.
- Replaced unverified history/statistics and testimonials in the rendered draft with general copy and placeholders. Original components remain in src/components for review and restoration.
- Added location/contact placeholders, footer, accessible focus states and Spanish page metadata.
- Did not use the generated hero image; the user requested retaining the video.

## Required before launch

- Confirm menu items, ingredients, prices and availability.
- Supply approved food/team photos and restaurant story.
- Confirm WhatsApp/order channel and service details.
- Supply exact address, map link and hours.
- Supply official social links and source links for any approved reviews.

Order buttons currently explain that ordering is not yet available. They do not accept or send orders.

## Verification

- Production build and TypeScript checks passed.
- Browser checked desktop and phone layouts with no horizontal document overflow.
- All section anchor targets exist.
- Tested menu navigation, category filtering, dish-specific inquiry dialog, Escape dismissal, mobile menu opening/closing, location navigation and header ordering dialog.
- Original video loaded and played; pause/resume worked.
- Corrected sticky header scrolling and verified location target remains below header on phone.

## Sharing with Sergio

Review this local draft first. Then push this draft branch and open a pull request for comparison. Merging into main triggers the repository's GitHub Pages workflow. Do not merge until the content and design are approved.

## Development

```sh
npm ci
npm run dev -- --host 127.0.0.1
npm run build
```
