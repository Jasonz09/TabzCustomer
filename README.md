# Tabz POS Demo

This is a minimal demo of a point-of-sale / ordering UI built with Vite + React. It demonstrates:

- Restaurant selection (list)
- Menu browsing and add-to-cart
- Cart with subtotal, tax, total
- Per-restaurant demo points and a simple "Redeem points" UI
- Dine-in code input to simulate table linking

Run locally:

1. cd into the project
2. npm install
3. npm run dev

Notes:
- This is a front-end demo. For production you'd add a backend for orders, auth, real points ledger, and secure dine-in code verification.
- The per-restaurant points are in `src/data/sample.js` as `demoCustomerPoints` and `pointsRate`.
 - Restaurants can optionally belong to a corporate/shared points group using `corpCode` in `src/data/sample.js`.
	 - When a restaurant has a `corpCode`, the demo stores a shared group balance in localStorage under `pointsGroup_<corpCode>` and redemptions debit that group balance.
	 - If a restaurant does not have a `corpCode`, redemptions debit the restaurant's personal demo balance stored under `pointsMap_<restaurantId>`.
