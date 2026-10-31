# Ajitate design refinement — October 31, 2026

Local preview: http://127.0.0.1:5173/Ajitate/

Preserved the existing red/black identity, supplied logo, original video and source menu. Added desktop hero links, a larger mobile headline and shorter introduction, local video poster and play/pause controls. Refined category navigation, search, menu cards, combo banners, special-edition layout, photo gallery and contact panels. Added accent-insensitive search, clear/reset actions, quick-add feedback and mobile navigation Escape/outside-click dismissal. Removed infinite badge motion, including its incorrect reduced-motion behavior.

The external story image returned HTTP 401. Replaced it with an existing local restaurant photo, with a neutral caption that does not identify the guest as an owner. No new generated images. Existing menu illustrations are identified as illustrative.

Deferred the optional delivery-map module until checkout details: initial JavaScript is now approximately 319 kB (105 kB gzip), versus 470 kB (149 kB gzip) before the split. This measures bundle size, not field loading speed.

## Verification

- TypeScript, Vite production build, five existing pricing/phone tests and git whitespace checks passed.
- Chromium at 360×800, 390×844, 768×1024, 1024×768 and 1440×1000: no horizontal page overflow; reduced-motion video remains paused.
- All rendered image elements loaded after replacing the broken story asset. No uncaught page errors in the tested main journey.
- Mobile navigation Escape/focus return; accent-free `pina` search matches Piña Colada; empty-search recovery.
- Quick-add feedback, cart quantity increase/removal, empty recovery, two combos with papas totaling $10.98, pickup details and copyable inquiry summary. No real orders sent.
- Desktop and mobile screenshots reviewed, including hero, menu, specials, story, gallery, reviews and contact areas. Screenshots and machine-readable results are alongside this file.
- Physical devices/Safari were not tested. Existing hours, prices and availability were preserved, not independently reverified.

The site remains a local draft. The inquiry flow does not transmit orders or take payments. Dist and the legacy docs preview were refreshed without deleting pre-existing extra user images. No push or publication.

Production smoke check also passed: deferred delivery map opens and accepts a manually selected point; the original video plays and pauses through the new controls.
