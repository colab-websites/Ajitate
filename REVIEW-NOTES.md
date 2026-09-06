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

This revision restores Sergio's original visual direction after the first draft was rejected.

- Restored the original full-screen video hero, animated distressed headline, spinning badge, asymmetric specialty cards, expanded story and review carousel from Sergio's latest saved source.
- Kept the same original Cloudinary video URL. No generated image is used.
- Changed stage scaling from fill/crop to fit with safe margins. The full-screen hero remains; headline, badge and all three social icons stay inside the window.
- Preserved the floating liquid-glass navigation, added section links and active-section feedback, and gave the logo a dark glass backing after scrolling.
- Connected order buttons to a dish-specific availability dialog. Ordering remains unavailable until the official channel is supplied.
- Retained missing-image placeholders, labeled sample menu content and prices, and labeled existing reviews as source-unconfirmed.
- Added location, hours, ordering and social placeholders in matching dark glass panels, plus a footer.
- Mobile uses the original video/card visual language with a working glass navigation dropdown. Removed inactive template search/avatar/product controls.
- Added keyboard focus visibility, touch visibility for card actions, labeled carousel controls, Spanish metadata and safe mobile review-card sizing.

## Required before launch

- Confirm menu items, ingredients, prices and availability.
- Supply approved food/team photos and confirm the existing restaurant history and statistics.
- Confirm WhatsApp/order channel and service details.
- Supply exact address, map link and hours.
- Supply official social links and source links for any approved reviews.

Order buttons currently explain that ordering is not yet available. They do not accept or send orders.

## Verification

- Production build, TypeScript and whitespace checks passed.
- Desktop hero matched viewport height. Original video loaded and played.
- Social-icon bounds stayed entirely inside both desktop and narrower laptop viewports.
- Floating header fit inside the narrower laptop width.
- Scrolling applied the dark glass logo backing; visually checked it over the story section.
- All section anchor targets exist.
- Tested desktop navigation, header ordering dialog, mobile navigation opening/closing, menu destination and dish-specific ordering dialog.
- Visually reviewed the restored desktop hero and new matching glass contact panels.

## Sharing with Sergio

Review this local draft first. Then push this draft branch and open a pull request for comparison. Merging into main triggers the repository's GitHub Pages workflow. Do not merge until the content and design are approved.

## Development

```sh
npm ci
npm run dev -- --host 127.0.0.1
npm run build
```
