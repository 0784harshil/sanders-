# Sanders Liquor — public catalog site

Deployed example: **[sanders-peach.vercel.app](https://sanders-peach.vercel.app/)**

Static storefront for **Google Merchant Center**: crawlable product pages, **robots.txt**, **sitemap**, policies, and JSON-LD (`js/home.js`, `js/product.js`).

## Configuration

Update **`data/site.json`**:

- **`canonical_origin`** — must match the public site URL (no trailing slash), e.g. `https://sanders-peach.vercel.app`
- **`logo_url`** — full HTTPS URL to `images/logo.svg` on that host

Then align **`robots.txt`** and **`sitemap.xml`** with the same domain.

## Merchant Center product links

Use the same SKU as in `data/products.json`:

`https://sanders-peach.vercel.app/product.html?sku=SL-10001`

## Local preview

```bash
python -m http.server 8080
```

Open http://localhost:8080/

After deploy, test in Search Console **URL Inspection** and the [Rich Results Test](https://search.google.com/test/rich-results).
