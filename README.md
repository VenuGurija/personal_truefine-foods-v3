# TRUEFINE FOODS — v3

Retail and wholesale site for TRUEFINE FOODS, a dehydrated-food brand in Chityala, Nalgonda, Telangana. Shoppers can browse products, add retail packs to a cart, and check out. Businesses can send a bulk inquiry.

Repository: https://github.com/VenuGurija/personal_truefine-foods-v3

This is a separate project from earlier TRUEFINE sites. Keep those on their own GitHub repositories and Vercel projects, and deploy this version only from `personal_truefine-foods-v3`.

## Pages

- Home, product catalog, and product detail
- Cart and checkout (cash on delivery, or pay on WhatsApp)
- Order confirmation
- Bulk inquiry
- About and contact

The cart stays in the browser. Checkout emails the order through Web3Forms, appends one row to a Google Sheet when that log is configured, and opens WhatsApp with the same details.

## Stack

Next.js (App Router), React, TypeScript, and Tailwind CSS.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3001

## Production build

```bash
npm run build
npm start
```

## Deploy on Vercel

Import the GitHub repository above as a new Vercel project. Vercel detects Next.js. Use the default build command, `npm run build`. Set the variables from `.env.example` in the Vercel project, then redeploy.

Production ignores the local port `3001`. Vercel serves the app on its own URL.

## Order log (Google Sheet)

Each placed order can be one row in a Google Sheet you own. The sheet is free. No Make.com account is required.

1. Create a Google Sheet, for example `TRUEFINE orders`.
2. Open **Extensions → Apps Script** and replace the sample file with `scripts/google-sheet-order-log.gs`.
3. Choose a long random secret. Put that same value in `SECRET` at the top of the script and in `GOOGLE_SHEET_SECRET`.
4. **Deploy → New deployment → Web app**. Execute as **Me**. Who has access: **Anyone**.
5. Copy the web app URL into `GOOGLE_SHEET_WEBHOOK_URL`.
6. Place a test order. A tab named `Orders` appears, with the customer, packs, totals, and a Status dropdown (`New` through `Cancelled`).

The first order creates the header row. Placing the same order id again does not add a second row. Email still sends when `WEB3FORMS_ACCESS_KEY` is set, even if the sheet variables are empty.

Make.com’s free plan can do this later by appending each Web3Forms email to the sheet. Leave that until you want it; the Apps Script path already writes the row when checkout succeeds.
