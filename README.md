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

1. **Products** → select items you do not want → **Remove** / **Delete** (or use **Feeds** to replace the feed with a single row — depends how you ingest today).
2. **Add** one product (manual, supplemental feed, or API) using the values below **character-for-character** where applicable.

### Paste these values (must match `data/products.json`)

| GMC field | Value |
|-----------|--------|
| **id** / **offer id** | `SL-10001` |
| **title** | `Sanders Select Bourbon 750ml` |
| **description** | Same long paragraph as in `data/products.json` (open the file or the live product page after deploy). |

**Exact description (copy for GMC):**

```
750ml bottle of Sanders Select Bourbon sold at Sanders Liquor. Price, image, and availability on this page match our Google Merchant Center listing. Government warning: (1) According to the Surgeon General, women should not drink alcoholic beverages during pregnancy because of the risk of birth defects. (2) Consumption of alcoholic beverages impairs your ability to drive a car or operate machinery, and may cause health problems. Must be 21 or older; valid ID required at pickup.
```
| **link** | `https://sanders-peach.vercel.app/product.html?sku=SL-10001` |
| **image link** | `https://placehold.jp/2d1810/c9a227/600x600.png?text=Sanders+Select+Bourbon+750ml` |
| **price** | `42.99 USD` |
| **availability** | `in stock` |
| **condition** | `new` |
| **brand** | `Sanders Liquor` |
| **identifier exists** | `no` (unless you add a real **GTIN** in JSON and in GMC) |

**Channel / program:** If you use **local inventory**, keep your existing local settings; the **link** still helps Google match the landing page.

**Better approval odds:** Replace the placeholder **image link** with a real **HTTPS** photo of the bottle (same URL on the website in `products.json` and in GMC).

## Merchant Center product links

Use the same SKU as in `data/products.json`:

`https://sanders-peach.vercel.app/product.html?sku=SL-10001`

## Local preview

```bash
python -m http.server 8080
```

Open http://localhost:8080/

After deploy, test in Search Console **URL Inspection** and the [Rich Results Test](https://search.google.com/test/rich-results).
