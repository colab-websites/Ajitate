# Ajitate delivery quotes

The static site can request a live Uber Direct fee after a customer chooses **Cotizar con Uber Direct**. The separate server handles the merchant credentials and fixes the pickup location. This integration calls OAuth and the quote endpoint only. All customer address and pin data stays in request memory and is sent to Uber solely for that quote.

## Activate

1. Confirm Uber Direct production eligibility and pricing for Ajitate's pickup on Av. Don Bosco in Cuenca. The merchant needs its production client ID, client secret and customer ID. Confirm the street address and pickup pin with the restaurant. Uber's test account uses simulated responses.
2. Host `worker.mjs` as an ES module Worker using the standard Fetch API, e.g. Cloudflare Workers. Set the module entry to `integrations/uber-direct/worker.mjs`. Set these **server-only** environment bindings.

   | Binding | Value |
   | --- | --- |
   | `ALLOWED_ORIGIN` | Exact origin serving the restaurant frontend, including scheme and port if used, without a path or trailing slash |
   | `UBER_CLIENT_ID`, `UBER_CLIENT_SECRET`, `UBER_CUSTOMER_ID` | The restaurant's Uber Direct production credentials |
   | `UBER_PICKUP_STREET` | Verified street line for Ajitate on Av. Don Bosco. The server supplies Cuenca, Azuay, EC |
   | `UBER_PICKUP_LAT`, `UBER_PICKUP_LNG` | Merchant-confirmed pickup coordinates in decimal degrees |

3. Expose HTTPS `POST /quote` and `OPTIONS /quote` on that host. Use the host's rate limits for this publicly accessible path. Keep request-body logging, request sampling and header capture disabled. The origin check limits browsers and does not authenticate standalone HTTP clients.
4. Give the existing Vite build only `VITE_UBER_QUOTE_URL=https://<your-worker-host>/quote`. Rebuild the frontend when changing this setting. Omitting it hides the quote control and keeps the restaurant-confirmed delivery process.
5. Smoke-test one permitted address using the quote button. Confirm a fee/currency and expiry appear, edit the destination, and check that the old fee disappears. For an unserviceable route, the customer can still ask the restaurant to confirm delivery. No courier is booked.

Run `node --test tests/uberQuote.test.mjs tests/deliveryQuote.test.ts` locally for isolated fixture tests.

## Provider documentation

- [Uber Direct Ecuador merchant program](https://merchants.ubereats.com/ec/es/services/uber-direct/)
- [Uber Direct OAuth, quoting, and quote response fields](https://developer.uber.com/docs/deliveries/get-started)
- [Uber address and coordinate handling](https://developer.uber.com/docs/deliveries/guides/geocoding)
