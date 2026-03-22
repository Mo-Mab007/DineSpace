<div align="center">

<br>

<img src="https://img.shields.io/badge/🍽️-DineSpace-E8430A?style=for-the-badge&labelColor=1A1210" alt="DineSpace"/>

<br><br>

# DineSpace

### Premium Food Ordering Platform

**A production-grade food delivery web application built with zero frameworks, zero paid APIs, and zero backend.**
*Pure HTML · CSS · Vanilla JavaScript*

<br>

[![Status](https://img.shields.io/badge/Status-Live%20Demo-brightgreen?style=flat-square&logo=checkmarx&logoColor=white)](https://YOUR_USERNAME.github.io/dinespace)
[![Version](https://img.shields.io/badge/Version-5.2-E8430A?style=flat-square)](https://github.com/YOUR_USERNAME/dinespace/releases)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Leaflet](https://img.shields.io/badge/Map-Leaflet.js-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](./LICENSE)

<br>

[**🚀 Live Demo**](https://Mo-Mab007.github.io/dinespace) · [**📖 Documentation**](./docs) · [**🐛 Report Bug**](https://github.com/Mo-Mab007/dinespace/issues) · [**✨ Request Feature**](https://github.com/Mo-Mab007/dinespace/issues)

<br>

---

</div>

<br>

## 🗂️ Table of Contents

- [The Story](#-the-story)
- [Live Demo](#-live-demo)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Menu & Pricing](#-menu--pricing)
- [Promo Codes](#-promo-codes)
- [Map Integration](#-map-integration)
- [Security Architecture](#-security-architecture)
- [Dark Mode System](#-dark-mode-system)
- [Customization](#-customization)
- [Version History](#-version-history)
- [Bug Log](#-bug-log)
- [Roadmap](#-roadmap)
- [License](#-license)

<br>

---

## 📖 The Story

This project didn't start impressive.

It was a form with 3 menu items, an `alert()` popup, and a button that said "Add to Cart." That was version 1.

But I kept going. Every version taught me something new. Every bug made the code better.

**Version 2** added localStorage. **Version 3** embedded a real map. **Version 4** added dark mode, live search, wishlist, and a full security layer. **Version 5** cleaned up what didn't work. **v5.2** fixed the last visual bug — the footer disappearing in dark mode because it inherited a colour token it should never have touched.

Somewhere in the middle, it stopped feeling like a project and started feeling like a product.

So I built it like one.

<br>

---

## 🚀 Live Demo

> **[https://Mo-Mab007.github.io/dinespace](https://Mo-Mab007.github.io/dinespace)**

The live demo runs entirely in the browser. No server. No login. No setup.

> ⚠️ **Demo Notice** — The checkout flow is fully built and functional. The OTP email verification system exists in the codebase and is documented, but is **disabled in the demo**. Clicking "Place Order" goes directly to the success screen.

<br>
---

## ✨ Features

<details>
<summary><strong>🏠 Home Page</strong></summary>
<br>

- Animated hero with display typography, pulsing "Open Now" badge, and decorative CSS background blobs
- Scrolling marquee banner with key value propositions
- Stats row: Rating · Orders · Avg. ETA · On-Time %
- Food category pill strip
- Features grid (6 cards)
- How It Works — 3-step flow
- Popular items preview (4 bestsellers)
- Customer testimonials (3 review cards)
- Full-width CTA banner with promo code highlight
- Multi-column footer — always dark in both light and dark mode
- Mobile hamburger menu with slide-out drawer

</details>

<details>
<summary><strong>🍔 Menu Page</strong></summary>
<br>

- **14 dishes** across 6 categories: Burgers, Pizza, Salads, Pasta, Sides, Drinks
- **Live search** — searches across dish names, descriptions, and ingredient tags on every keystroke
- **Sort** — Featured / Price Low→High / Price High→Low / Name A–Z
- **Category filter tabs** — sticky below the nav, works simultaneously with search and sort
- **Wishlist** — heart any dish, slide-out panel, floating FAB with count, persists in `localStorage`
- Item **badges** — Popular, New, Spicy, Vegetarian
- Calorie count and prep time on every card
- Ingredient tags per dish
- Floating cart bar with live item count, total in EGP, and item name preview
- "No results" state with clear search option

</details>

<details>
<summary><strong>🗺️ Checkout + Embedded Map</strong></summary>
<br>

- **Embedded Leaflet.js map** — no API key required
  - Click anywhere on the map → pin drops → address auto-filled via Nominatim reverse geocoding
  - **"My Location"** button requests browser GPS and centers the map
  - **Address search bar** — type any street, city, or landmark and the map flies to it
- Two-column layout: delivery form (left) + sticky order summary (right)
- Form validation with red error highlighting on empty required fields
- Quantity controls (+ / −) per item directly in the order summary
- Free delivery progress bar — fills as subtotal grows, turns green at 250 EGP
- Three payment options: Cash on Delivery · Credit/Debit Card · Digital Wallet
- Promo code input with instant discount calculation
- Special instructions / allergy notes field

</details>

<details>
<summary><strong>🎉 Success Modal</strong></summary>
<br>

- Animated SVG checkmark — circle draws itself, then the tick appears
- Live 35-minute delivery countdown timer
- Full order summary: customer name, items, address, total, unique order reference
- Order status pipeline: Placed → Preparing → On the Way → Delivered
- Demo notice banner: *"This is a demo version — no order has been placed"*

</details>

<details>
<summary><strong>🌙 Dark Mode</strong></summary>
<br>

- Toggle on every page, preference saved to `localStorage`
- Every element correctly themed: cards, forms, modals, map, nav, floating cart, toasts, footer
- Smooth CSS transitions on background, text, and border colour changes
- Footer permanently dark in **both** themes via dedicated CSS token system
- Toast and floating cart use flip tokens (`--toast-bg`, `--float-cart-bg`) that invert per theme

</details>

<details>
<summary><strong>🔒 Security Layer</strong></summary>
<br>

- Input sanitization on all form fields (HTML stripping, allowlist validation)
- All user data written via `textContent` — never `innerHTML` (XSS prevention)
- `crypto.getRandomValues()` for order reference generation
- Cart data integrity: price coercion, qty range checks (1–99), 50-item cap
- Automatic cart migration — heals old localStorage formats on load

> **OTP System (built, disabled in demo):** Cryptographically secure 4-digit code generation, 10-minute expiry, 3-attempt lockout, 3-email rate limiting per 15-minute window, constant-time code comparison. Ready to connect to a real backend.

</details>

<br>

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **HTML5** | — | Semantic page structure |
| **CSS3** | — | Design token system, Grid, Flexbox, keyframe animations |
| **Vanilla JavaScript** | ES6 | All logic — cart, map, validation, search, sort, wishlist |
| **Leaflet.js** | 1.9.4 | Embedded interactive map |
| **OpenStreetMap** | — | Free map tiles (no API key) |
| **Nominatim** | — | Free reverse + forward geocoding |
| **Web Crypto API** | — | Secure random order reference generation |
| **Google Fonts** | — | Playfair Display + DM Sans |
| **LocalStorage** | — | Cart, wishlist, dark mode preference |

**Zero npm packages. Zero build step. Zero paid services.**

<br>

---

## 📁 Project Structure

```
dinespace/
│
├── 📄 index.html          ← Home page
├── 📄 menu.html           ← Menu with search, filters, wishlist
├── 📄 checkout.html       ← Checkout with embedded map + success modal
├── 🎨 style.css           ← Complete design system (CSS variables + dark mode)
├── ⚙️  app.js              ← All JavaScript logic
│
├── 📄 dinespace-ui-ux.html  ← Complete UI/UX design system
├── 📄 README.md
└── 📄 LICENSE
```

<br>

---

## 🍽️ Menu & Pricing

All prices are in **Egyptian Pounds (EGP)**.

| Category | Item | Price |
|----------|------|-------|
| 🍔 Burgers | Classic Smash Burger | 120.00 EGP |
| 🍔 Burgers | Avocado Chicken Burger | 140.00 EGP |
| 🍔 Burgers | Spicy BBQ Beef Burger | 130.50 EGP |
| 🍕 Pizza | Margherita Pizza | 150.00 EGP |
| 🍕 Pizza | Truffle Mushroom Pizza | 190.00 EGP |
| 🍕 Pizza | Meat Feast Pizza | 180.00 EGP |
| 🥗 Salads | Caesar Salad | 90.00 EGP |
| 🥗 Salads | Mixed Berry & Feta Salad | 110.00 EGP |
| 🍜 Pasta | Spaghetti Bolognese | 160.00 EGP |
| 🍜 Pasta | Four Cheese Penne | 150.00 EGP |
| 🍟 Sides | Seasoned Fries | 50.00 EGP |
| 🍟 Sides | Onion Rings | 50.50 EGP |
| 🥤 Drinks | Freshly Squeezed OJ | 40.50 EGP |
| 🥤 Drinks | Mixed Berry Smoothie | 60.00 EGP |

**Delivery fee:** 25.00 EGP — **waived automatically above 250.00 EGP**

<br>

---

## 🎟️ Promo Codes

| Code | Discount | Status |
|------|----------|--------|
| `DINE10` | 10% off | ✅ Active |
| `DINE20` | 20% off | ✅ Active |
| `WELCOME` | 15% off | ✅ Active |
| `FRESH26` | 26% off | ✅ Active |

To add or remove codes, edit `app.js`:

```javascript
var codes = {
    'DINE10':  0.10,
    'DINE20':  0.20,
    'WELCOME': 0.15,
    'FRESH26': 0.26,
};
```

<br>

---

## 🗺️ Map Integration

DineSpace uses **Leaflet.js** with **OpenStreetMap** tiles and the **Nominatim** geocoding API.

**Completely free. No API key. No credit card.**

| User Action | Result |
|------------|--------|
| Page loads | Map centers on Cairo — requests GPS permission |
| GPS granted | Map flies to user's real location, drops pin, fills address |
| GPS denied | Map stays at default center — user can click or search |
| Click on map | Drops pin, reverse-geocodes, auto-fills delivery address field |
| Type + Search | Map flies to result, drops pin, fills address |
| "My Location" button | Re-requests GPS, re-centers map, drops pin |

### Change the default map center

In `app.js` inside `initMap()`:

```javascript
// Default: Cairo, Egypt
mapInstance = L.map('leaflet-map').setView([30.0444, 31.2357], 13);
```

Common cities:

```javascript
[30.0444,  31.2357]   // Cairo, Egypt     ← current default
[31.2001,  29.9187]   // Alexandria, Egypt
[25.2048,  55.2708]   // Dubai, UAE
[51.5074,  -0.1278]   // London, UK
[40.7128,  -74.0060]  // New York, USA
[48.8566,   2.3522]   // Paris, France
```

<br>

---

## 🔒 Security Architecture

DineSpace is a client-side demo. The following security measures are implemented as best practices and protect against real frontend attack vectors.

### Input Sanitization

```javascript
// Strips HTML tags → prevents XSS via stored values
function sanitizeText(str, maxLen) {
    return str.replace(/<[^>]*>/g, '').trim().slice(0, maxLen);
}

// Email: character allowlist only
function sanitizeEmail(str) {
    return str.replace(/[^a-zA-Z0-9@._+\-]/g, '').slice(0, 120);
}

// Phone: digits and formatting characters only
function sanitizePhone(str) {
    return str.replace(/[^0-9+\-()\s]/g, '').slice(0, 20);
}
```

### XSS Prevention

```javascript
// ✅ Always — user data goes to DOM via textContent
textSpan.textContent = item.name;

// ❌ Never — innerHTML would execute injected scripts
element.innerHTML = item.name;
```

### Cart Data Integrity

```javascript
// sanitizeCart() runs on every page load — heals any old data
price: isNaN(price) || price < 0 ? 0 : Math.round(price * 100) / 100,
emoji: i.emoji ? i.emoji : '🍽️',
qty:   isNaN(qty) || qty < 1   ? 1 : Math.min(qty, 99)
```

### Cryptographic Order References

```javascript
// crypto.getRandomValues() — OS-level entropy, unpredictable
var arr = new Uint8Array(8);
window.crypto.getRandomValues(arr);
// Produces references like: DS-X7K2MNQR
```

### OTP System *(built, disabled in demo)*

| Feature | Implementation |
|---------|---------------|
| Code generation | `crypto.getRandomValues()` — not `Math.random()` |
| Code expiry | 10-minute timestamp check |
| Attempt limit | 3 wrong tries → lockout + code invalidation |
| Rate limiting | Max 3 emails per 15-minute session window |
| Comparison | Constant-time XOR — prevents timing attacks |

<br>

---

## 🌙 Dark Mode System

Dark mode uses a `[data-theme]` attribute on `<html>` and CSS custom properties.

### Token Architecture

```css
/* Light mode — all tokens defined here */
:root {
    --ink:        #1A1210;   /* near-black text */
    --page-bg:    #FDFAF6;   /* warm cream background */
    --card-bg:    #FFFFFF;

    /* Footer tokens — NOT overridden in dark mode */
    --footer-bg:      #1A1210;   /* always dark */
    --footer-text:    rgba(255,255,255,.6);
    --footer-logo:    #FFFFFF;

    /* Flip tokens — invert in dark mode */
    --toast-bg:       #1A1210;
    --toast-text:     #FFFFFF;
}

/* Dark mode — only overrides what needs to change */
[data-theme="dark"] {
    --ink:        #F0EBE6;   /* light text on dark background */
    --page-bg:    #0F0D0C;
    --card-bg:    #1C1816;

    /* Flip tokens invert */
    --toast-bg:   #F0EBE6;
    --toast-text: #1A1210;

    /* Footer tokens deliberately absent — footer stays dark */
}
```

### Toggle Logic

```javascript
var saved = localStorage.getItem('ds_theme') || 'light';
document.documentElement.setAttribute('data-theme', saved);

toggle.addEventListener('click', function() {
    var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ds_theme', next);
    toggle.textContent = next === 'dark' ? '☀️' : '🌙';
});
```

<br>

---

## 🎨 Customization

### Change the Brand Colour

All colours are CSS custom properties in `style.css`. Change `--brand` and the entire UI updates:

```css
:root {
    --brand:        #E8430A;   /* ← change this */
    --brand-dark:   #C23508;   /* ← and this (darker shade for hover) */
    --brand-light:  #FFF0EB;   /* ← and this (tinted backgrounds) */
}
```

### Add a Menu Item

Copy any `.menu-item` block in `menu.html`. Always pass all **3 arguments** to `addToCart()`:

```html
<div class="menu-item" data-cat="burgers" data-price="145" data-name="My New Burger" data-order="15">
    <button class="wishlist-btn" data-item="My New Burger" title="Save for later">🤍</button>
    <div class="item-emoji">🍔</div>
    <div class="item-info">
        <div class="item-badges"><span class="badge badge-new">New</span></div>
        <h3>My New Burger</h3>
        <p class="item-desc">Your description here</p>
        <div class="item-meta">
            <span class="item-cal">🔥 550 kcal</span>
            <span class="item-time">⏱ 15 min</span>
        </div>
        <div class="item-tags"><span class="tag">Beef</span></div>
    </div>
    <div class="item-footer">
        <span class="item-price">145.00 EGP</span>
        <button class="add-btn" onclick="addToCart('My New Burger', 145.00, '🍔')">+ Add</button>
    </div>
</div>
```

> ⚠️ `data-name` must **exactly match** the first argument to `addToCart()` — this is what powers the search and sort features.

### Change Delivery Settings

```javascript
// app.js — top of file
var DELIVERY_FEE            = 25;    // Flat delivery fee in EGP
var TAX_RATE                = 0.08;  // 8% tax
var FREE_DELIVERY_THRESHOLD = 250;   // Free delivery above 250 EGP
```

### Change the Currency

```javascript
// app.js — helper function
function egp(amount) {
    return amount.toFixed(2) + ' EGP';  // ← change 'EGP' to any currency symbol
}
```

<br>

---

## 📋 Version History

| Version | What Changed |
|---------|-------------|
| **v1.0** | Initial release — 3 menu items, `alert()` feedback, basic form, no persistence |
| **v2.0** | Full redesign — Leaflet map, EmailJS OTP, localStorage cart, 14-item menu, CSS token system |
| **v3.0** | Bug fixes — `$NaN` cart prices, broken remove button, page freeze after checkout. Added embedded map. |
| **v4.0** | Dark mode, live search, sort, wishlist, security layer, marquee, testimonials, mobile drawer |
| **v5.0** | Removed EmailJS/OTP → demo mode. Fixed dark mode font bug across all elements. |
| **v5.1** | EGP currency migration — `egp()` helper, fixed double currency, corrected `data-price` mismatches |
| **v5.2** | Fixed footer disappearing in dark mode — dedicated `--footer-*` token system |

<br>

---

## 🐛 Bug Log

Every bug documented, explained, and fixed.

| Version | Bug | Root Cause | Fix Applied |
|---------|-----|-----------|------------|
| v2→v3 | `$NaN` prices in cart | Old localStorage items had no `qty` field — `undefined × price = NaN` | `sanitizeCart()` coerces all fields on load |
| v2→v3 | `undefined` emoji in cart | Old items had no `emoji` field | Default to `🍽️` when missing |
| v2→v3 | Remove button silently broken | Inline `onclick` string broke on item names with apostrophes | `data-index` + `addEventListener` — no string interpolation |
| v2→v3 | Website froze after verify | `window.location.href` redirect fired mid-execution | Replaced with in-page success modal |
| v4→v5 | Text invisible in dark mode | Hundreds of elements used hardcoded colours instead of CSS vars | All text uses `--ink`, `--ink-mid`, `--ink-light` |
| v4→v5 | Toast invisible in dark mode | Hardcoded `background:#1A1210` blended into dark page | `--toast-bg` / `--toast-text` flip tokens |
| v4→v5 | Floating cart invisible in dark mode | Same hardcoded colour issue | `--float-cart-bg` / `--float-cart-text` flip tokens |
| v5.1 | Double currency (`0.00 EGP EGP`) | HTML had ` EGP` suffix on spans that JS also appended EGP to | Separated static HTML text from JS-written values |
| v5.1 | Sort-by-price gave wrong order | `data-price="135"` didn't match `addToCart(..., 130.50)` | Aligned all `data-price` attributes with actual prices |
| v5.2 | Footer disappeared in dark mode | `background: var(--ink)` — `--ink` turns cream in dark mode | Dedicated `--footer-bg` token excluded from dark override |

<br>

---

## 🗺️ Roadmap

- [ ] **v6.0** — Node.js + Express backend with real order storage
- [ ] Real payment integration (Stripe / PayPal / Fawry)
- [ ] Re-enable OTP email verification with backend session management
- [ ] User accounts with order history and saved addresses
- [ ] Admin dashboard — manage menu, view orders, update status
- [ ] Real-time order tracking with live map marker movement
- [ ] WebSocket-based live status updates (Placed → Preparing → On the Way)
- [ ] Progressive Web App (PWA) — installable on mobile home screen
- [ ] Push notifications for order status
- [ ] Item ratings and customer reviews system
- [ ] Multi-language support + RTL layout for Arabic
- [ ] Calorie and allergen filter on menu

<br>

---

## 🤝 Contributing

Contributions are welcome. For major changes, open an issue first.

```bash
# Fork the repo, then:
git checkout -b feature/my-feature
git commit -m "Add: description of your change"
git push origin feature/my-feature
# Open a Pull Request
```

**Please keep the zero-dependency philosophy** — no npm packages, no build tools, no bundlers.

<br>

---

## 📄 License

```
MIT License

Copyright (c) 2025 YOUR_NAME

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

Full license text in [`LICENSE`](./LICENSE).

<br>

---

## 📬 Contact

| Channel | Link |
|---------|------|
| 📧 Email | mo.mabrouk007@gmail.com |
| 💼 LinkedIn | [Your LinkedIn](www.linkedin.com/in/mohamed-mabrouk-b72414278) |
| 🐙 GitHub | [@Mo-Mab007](https://github.com/Mo-Mab007) |
| 🌐 Live Demo | [dinespace.github.io](https://Mo-Mab007.github.io/dinespace) |

<br>

<br>

---

*© 2025 DineSpace. MIT Licensed.*

</div>
