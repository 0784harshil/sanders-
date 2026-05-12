# Sanders Liquor — public catalog site

Static storefront used with **Google Merchant Center**: crawlable product pages, **robots.txt**, **sitemap**, policies, and JSON-LD (see `js/home.js` and `js/product.js`).

## Live site (after GitHub Pages is enabled)

Project Pages URL: **https://0784harshil.github.io/sanders-/**

If you use a **custom domain**, update `canonical_origin` and `logo_url` in **`data/site.json`**, and replace URLs in **`robots.txt`** and **`sitemap.xml`**.

## Edit content

| File | Purpose |
|------|---------|
| `data/site.json` | Business name, address, phone, verification token, shipping defaults |
| `data/products.json` | SKU, title, price, availability, images — must match Merchant Center |

## GitHub Pages setup

1. Repo → **Settings** → **Pages**
2. **Source**: Deploy from branch **main**, folder **/ (root)**
3. Save; wait a few minutes for **https://0784harshil.github.io/sanders-/** to serve

## Merchant Center

Use product links like:

`https://0784harshil.github.io/sanders-/product.html?sku=SL-10001`

(SKU must match your feed and `products.json`.)

## Local preview

```bash
python -m http.server 8080
```

Open http://localhost:8080/

Use Search Console’s **URL Inspection** tool on a product URL after deploy to confirm Google can crawl the page.
