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

Confirmed address/map, opening hours, delivery coverage/fee, payment methods and the restaurant's preferred order channel. Review authenticity still needs source confirmation.
