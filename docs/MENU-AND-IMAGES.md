# Menu, ordering and image notes

## Source

Transcribed from the four screenshots supplied by the user on September 5, 2026:
- Safari 2026-09-05 21.54.57.png: Hamburguesas and Edición Especial.
- Safari 2026-09-05 21.55.01.png: Tex-Mex.
- Safari 2026-09-05 21.55.04.png: Especiales.
- Safari 2026-09-05 21.55.09.png: Bebidas, Cervezas and Cocteles.

47 separately priced options, including taco fillings and rib portion sizes. Source phone: 0983047406 (+593983047406). Source Instagram: @ajitate.ec. Prices are stored in integer USD cents in src/data/menu.ts. Burger and Tex-Mex combo: +$1.99 per unit for chilli nachos or papas plus a beverage. Beverage brand/size, delivery fee, pickup arrangements, stock and payment method need restaurant confirmation. Edición Especial is displayed under Especiales.

The current checkout is an order-preparation flow: browse, configure, cart, customer/delivery details, review, copy and call. It does not accept payment, submit an order or claim restaurant confirmation. WhatsApp support for the source phone has not been confirmed, so the fallback is a copyable summary and telephone link. Test details were dummy local data and were not transmitted to the restaurant. The cart is retained while the page stays open; a page refresh clears it. No customer details are saved to persistent storage.

## Generated images

Built-in image generation was used. Category images are clearly labeled as illustrative and are not presented as authentic photos or exact depictions of every item in a category. All are saved in the repository:

- public/images/burgers.png
- public/images/texmex.png
- public/images/specials.png

Shared prompt:
Create one landscape 3:2 premium editorial food photograph for a dark liquid-glass Tex-Mex restaurant menu. [SUBJECT] Photorealistic, warm directional studio light, deep near-black backdrop and matte charcoal table, natural portions, restrained red accents. Centered composition with breathing room, entire dish inside frame. No text, no logos, no collage, no border, no people. Illustrative menu category image, not a claimed actual restaurant photograph.

Subjects:
- Burgers: A premium double smash cheeseburger on potato bread with melted cheddar and pickles. Entire burger visible, no fries.
- Tex-Mex: Three birria beef tacos with melted cheese, guacamole and a small side of consommé, on a dark ceramic plate.
- Specials: Barbecue pork ribs glazed with smoky barbecue sauce, rustic fries, celery and carrot sticks, a small creamy scallion dip, on a dark ceramic plate.

The original hero video is unchanged.

## Validation

- Menu identity/count, integer prices, mixed combo subtotals, plain/variant line separation and unsupported combo handling tested with Node's test runner.
- Browser: two Solo Queso? combos with papas correctly total $10.98. Customer details carry into the copyable summary without transmission. Quantity/removal and empty-cart recovery tested.
- Mobile drawer/close-button bounds checked; all five review cards measured the same width and 390px height.
- Production build checked before local save.

## Next launch inputs

Delivery coverage/fee, payment methods and the restaurant's preferred order channel still need confirmation. Four review sources remain unverified.


## September 6 refinement

- Center review stays prominent; neighbors step downward, shrink slightly and blur. Removed the invisible drag overlay and nested review scrolling; vertical page scrolling works over the cards. Horizontal touch swipes still change reviews.
- Removed the duplicate logo inside the mobile hero. Original video unchanged.
- Added optional OpenStreetMap delivery picker, draggable pin and a Google Maps preview link. No automatic location access. Pin remains in page memory and is intentionally excluded from the copied order summary; no coordinates are sent to the restaurant.
- Added free napkin/straw choices to the summary.
- Combo banners now use public/images/combo.png and explain that the beverage is included with a choice of chilli nachos OR fries. Generated illustration, not an authentic dish photograph.

Combo image prompt:
Create one landscape 3:2 realistic editorial food category photograph for an Ecuadorian Tex-Mex restaurant combo upgrade. Three separated items on a matte near-black table: on the left a small bowl of chilli nachos with beef chilli and cheddar; in the middle a small bowl of golden rustic fries; on the right one clear glass of dark cola with ice. These are ALTERNATIVE side options plus an INCLUDED drink, so keep distinct dishes clearly separated, do not merge them into one serving. No burger or tacos. Entire bowls and glass in frame, generous breathing room, warm premium studio lighting, same dark elegant red-accent restaurant photography look. No text, no logos, no borders, no collage. Illustrative image, not actual restaurant photo.

Public sources checked September 6, 2026:
- https://www.instagram.com/ajitate.ec/ bio publishes Tuesday–Saturday 12:00–15:00 and 18:00–22:00. Added these with source attribution.
- Official Instagram's Local 1 map link: https://maps.app.goo.gl/FTVdfzcjXtNxwSw76 . Resolves to Ají tate, 3XMF+X8M, Av. Don Bosco, Cuenca. Added address and map.
- Google listing shows 24 hours, conflicting with the Instagram schedule; did not adopt that claim.
- Nicole Cajamarca's review on that Google listing matches the existing review text. Other four reviews were not independently confirmed; the section remains marked source pending rather than claiming all are verified.

Validation: production build and menu tests; browser checkout with dummy data, optional map selection, free extras in $3.50 summary, no coordinates in copied text; review scroll moved page from 7016 to 7373px while pointer was over the card. No order submitted.
