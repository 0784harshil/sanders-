# Sanders Liquor — public catalog site

Deployed example: **[sanders-peach.vercel.app](https://sanders-peach.vercel.app/)**

Static storefront for **Google Merchant Center**: crawlable product pages, **robots.txt**, **sitemap**, policies, and JSON-LD (`js/home.js`, `js/product.js`).

## Configuration

Update **`data/site.json`**:

- **`canonical_origin`** — must match the public site URL (no trailing slash), e.g. `https://sanders-peach.vercel.app`
- **`logo_url`** — full HTTPS URL to `images/logo.svg` on that host

Then align **`robots.txt`** and **`sitemap.xml`** with the same domain.

### `data/products.json`

Keep this file aligned with your Merchant Center feed:

| Field | Should match GMC |
|-------|------------------|
| `sku`, `gmc_offer_id` | **Offer ID** / item id in the feed |
| `link` | **Link** attribute (full product URL) |
| `title`, `description`, `price`, `currency`, `availability`, `image`, `brand`, `condition` | Same values as in the feed |

Optional: **`gtin`** (digits only) when your feed includes a GTIN.

## Add exactly one product in Merchant Center (manual test)

Do this **in Google Merchant Center** (we cannot access your account):

1. **Products** → remove other items if you only want this test listing.
2. **Add** one product using the values below so they match **`data/products.json`** after deploy.

### Paste these values (must match the site)

| GMC field | Value |
|-----------|--------|
| **id** / **offer id** | `JAMESON-IRISH-WHISKEY-200ML` |
| **title** | `Jameson Irish Whiskey 200 ml` |
| **link** | `https://sanders-peach.vercel.app/product.html?sku=JAMESON-IRISH-WHISKEY-200ML` |
| **image link** | `https://sanders-peach.vercel.app/images/jameson-irish-whiskey-200ml.png` |
| **price** | `9.99 USD` |
| **availability** | `in stock` |
| **condition** | `new` |
| **brand** | `Jameson` |
| **identifier exists** | `no` (unless you add a real **GTIN** in JSON and in GMC) |

**Exact description (copy for GMC):**

```
The nose highlights a mellow pot whiskey with toasted wood and sherry undertones. The taste is smooth and sweet with mild, woody and nutty notes, with an incredibly smooth finish. 200 ml bottle. Government Issued ID Required for Purchase. You must be 21 years of age or older to purchase this product.
```

**Channel / program:** If you use **local inventory**, keep your existing local settings; the **link** still helps Google match the landing page.

## Merchant Center product links

Current product URL (matches `sku` in `data/products.json`):

`https://sanders-peach.vercel.app/product.html?sku=JAMESON-IRISH-WHISKEY-200ML`

## Local preview

```bash
python -m http.server 8080
```

Open http://localhost:8080/

After deploy, test in Search Console **URL Inspection** and the [Rich Results Test](https://search.google.com/test/rich-results).
