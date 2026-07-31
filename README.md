# Pure Aqua 💧

Water can booking & delivery web app — Phase 1 (customer side).

## Live demo (after you deploy)
`https://<your-github-username>.github.io/<repo-name>/`

## What's included (Phase 1)
- `index.html` — entry point, routes to splash or home
- `splash.html` — branded loading screen
- `login.html` / `register.html` — customer auth (stored on-device)
- `home.html` — dashboard with wallet balance + quick booking
- `booking.html` — choose can, quantity, address, delivery slot
- `orders.html` — order history with live status timeline
- `wallet.html` — balance + add money + transaction history
- `profile.html` — edit profile, logout
- `about.html` / `contact.html` — info pages
- `css/style.css` — shared design system
- `js/app.js` — data layer (localStorage-based demo backend)

## How data works right now
There's no server yet. Accounts, orders, and wallet balances are saved in
the browser's `localStorage`, per device. This is enough to demo the full
flow end-to-end. Phase 2 swaps this for Firebase (auth, database, real
payments, GPS tracking) — the functions in `js/app.js` are written so that
swap only touches one file.

## Deploy to GitHub Pages
1. Create a new GitHub repository (e.g. `pure-aqua`).
2. Upload **all files, keeping the folder structure** (`css/`, `js/`, and
   every `.html` file at the repo root).
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Branch: `main`, folder: `/ (root)` → **Save**.
6. Wait 1–2 minutes, then open the URL GitHub shows you
   (`https://<username>.github.io/<repo-name>/`).

## Try it
1. Open the site → splash screen → tap through to **Create an account**.
2. Register with any 10-digit number + password. You start with ₹100 wallet credit.
3. Book a can from **Home → Book a can**.
4. Watch the order move through its stages on the **Orders** tab
   (it auto-advances every ~15 seconds so you can see the timeline work).
5. Top up your wallet any time from the **Wallet** tab.

## Phase 2 (later)
Vendor panel, delivery-partner panel, admin panel, real online payments,
Firebase database, push notifications, GPS tracking — matching the
original roadmap. These come as `vendors.html`, `delivery.html`,
`admin.html` once Phase 1 is confirmed working.
