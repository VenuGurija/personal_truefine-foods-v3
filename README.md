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

Orders and the cart stay in the browser. Checkout opens WhatsApp with the order details. There is no database and no environment variables.

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

Import the GitHub repository above as a new Vercel project. Vercel detects Next.js. Use the default build command, `npm run build`. Leave the environment variables empty.

Production ignores the local port `3001`. Vercel serves the app on its own URL.
