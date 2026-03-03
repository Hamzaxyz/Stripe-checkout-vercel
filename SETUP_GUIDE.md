# Stripe Checkout — GitHub + Vercel + Shopify Setup Guide

---

## PROJECT STRUCTURE

```
stripe-checkout/
├── api/
│   ├── create-checkout-session.js   ← POST /create-checkout-session
│   └── session-status.js            ← GET /session-status
├── public/
│   ├── checkout.html
│   ├── checkout.js
│   ├── return.html
│   ├── return.js
│   └── style.css
├── .env.example
├── .gitignore
├── package.json
└── vercel.json
```

---

## STEP 1 — PUSH TO GITHUB

1. Go to https://github.com and create a **New Repository**
   - Name: `stripe-checkout` (or anything you like)
   - Set to **Private** (recommended — keeps your config separate)
   - Do NOT initialize with README

2. On your computer, open terminal in the project folder and run:

```bash
git init
git add .
git commit -m "Initial Stripe Checkout setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/stripe-checkout.git
git push -u origin main
```

> ⚠️ The `.env` file is in `.gitignore` — it will NOT be pushed. Good. Keep secrets off GitHub.

---

## STEP 2 — DEPLOY TO VERCEL

1. Go to https://vercel.com and sign in with your GitHub account

2. Click **"Add New Project"** → Import your `stripe-checkout` repo

3. On the configuration screen:
   - Framework Preset: **Other**
   - Root Directory: leave as `/`
   - Leave build settings blank

4. Click **"Environment Variables"** and add these 3 variables:

   | Name                  | Value                                      |
   |-----------------------|--------------------------------------------|
   | `STRIPE_SECRET_KEY`   | `sk_test_51T4kLx...` (your secret key)     |
   | `STRIPE_PRICE_ID`     | `price_1T4kmp2Uy...` (your price ID)       |
   | `DOMAIN`              | Leave blank for now — add after first deploy |

5. Click **Deploy** and wait ~1 minute

6. Once deployed, copy your Vercel URL (e.g. `https://stripe-checkout-abc123.vercel.app`)

7. Go to Vercel → Your Project → **Settings → Environment Variables**
   - Add: `DOMAIN` = `https://stripe-checkout-abc123.vercel.app`
   - Click **Save**, then go to **Deployments** → **Redeploy**

8. Test by visiting: `https://your-project.vercel.app/checkout.html`

---

## STEP 3 — INTEGRATE WITH SHOPIFY

You have two clean options:

---

### OPTION A — Button Link (Simplest)

Add a "Buy Now" button anywhere in Shopify that links directly to your Vercel checkout page.

In Shopify Admin:
1. Go to **Online Store → Themes → Customize**
2. Add a **Button** or **Custom HTML** block
3. Set the link to: `https://your-project.vercel.app/checkout.html`

Or in any page/product description, add:
```html
<a href="https://your-project.vercel.app/checkout.html"
   style="background:#635bff;color:white;padding:12px 24px;
          border-radius:6px;text-decoration:none;font-weight:600;">
  Buy Now
</a>
```

---

### OPTION B — Embedded iFrame in Shopify Page

1. In Shopify Admin → **Online Store → Pages** → Create new page
2. Click **"<>"** (HTML editor) and paste:

```html
<iframe
  src="https://your-project.vercel.app/checkout.html"
  width="100%"
  height="700px"
  frameborder="0"
  style="border:none;">
</iframe>
```

3. Save the page and link to it from your nav or product page

---

### OPTION C — Shopify Buy Button + Stripe for Custom Products

If you want to bypass Shopify payments entirely for a specific product:
1. Remove that product from Shopify checkout
2. Replace "Add to Cart" with a link/button to your Vercel URL
3. Use Shopify's **Custom Liquid** section to inject the button

---

## STEP 4 — GO LIVE (When Ready)

1. In **Stripe Dashboard** → switch from Test to Live mode
2. Get your **Live Secret Key** (`sk_live_...`) and **Live Publishable Key** (`pk_live_...`)
3. Create a **Live Price ID** for your product
4. Update in Vercel Environment Variables:
   - `STRIPE_SECRET_KEY` → your live secret key
   - `STRIPE_PRICE_ID` → your live price ID
5. In `public/checkout.js`, replace the publishable key:
   ```js
   const stripe = Stripe("pk_live_YOUR_LIVE_KEY_HERE");
   ```
6. Push to GitHub → Vercel auto-redeploys

---

## YOUR CURRENT KEYS (from uploaded files)

| Item              | Value                                                              |
|-------------------|--------------------------------------------------------------------|
| Secret Key (test) | `sk_test_51T4kLx2Uy4uhkV7r...` (in server.rb)                     |
| Pub Key (test)    | `pk_test_51T4kLx2Uy4uhkV7r...` (in checkout.js)                   |
| Price ID (test)   | `price_1T4kmp2Uy4uhkV7rVDRi6IFt`                                  |

> ⚠️ These are TEST keys — safe for development. Replace with live keys before going live.
> ⚠️ Consider rotating these keys in Stripe Dashboard since they appeared in uploaded files.

---

## TROUBLESHOOTING

| Issue | Fix |
|-------|-----|
| Checkout page blank | Check browser console — likely wrong publishable key |
| 500 error on /create-checkout-session | Check Vercel logs — likely missing env variables |
| Payment succeeds but return page broken | Make sure `DOMAIN` env var is set correctly in Vercel |
| Shopify iframe blocked | Some themes block iframes — use Option A (button link) instead |

---

## SUPPORT

- Stripe Docs: https://stripe.com/docs/checkout/embedded
- Vercel Docs: https://vercel.com/docs
- Stripe Dashboard: https://dashboard.stripe.com
