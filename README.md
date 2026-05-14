# Sanders Liquor — public catalog site

Deployed example: **[sanders-peach.vercel.app](https://sanders-peach.vercel.app/)**

Static storefront for **Google Merchant Center**: crawlable product pages, **robots.txt**, **sitemap**, policies, and JSON-LD (`js/home.js`, `js/product.js`).

**Checkout:** Product pages include **Add to cart**, **Buy now** (deep-link to `checkout.html#add=SKU`), and **View cart**. Shoppers complete **Checkout** → **Complete purchase** → **Order confirmed** (cart uses `localStorage`; confirmation uses `sessionStorage` for that session). Align this flow with how you actually take payment (e.g. pay at pickup / phone).

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

## Fix: “Missing local inventory data” (Merchant Center)

Google expects **every local-eligible product** to have a matching row in **local product inventory** (per physical store): same **`id`** as your primary product feed (**case-sensitive**), plus **`store_code`**, **`quantity`**, and **`availability`**.

### 1. Store code (yours)

Use the value from **Google Business Profile → Advanced settings → Store code**:

**`04856394418950437793`**

### 2. Add a **Local product inventory** feed (not supplemental for wrong type)

1. **Products** → **Feeds** (or **Data sources**).
2. **Add feed** → choose **Local product inventory** (wording may be “Local inventory” / “Local product inventory”).
3. Upload a **.txt** or **.tsv** file (tab-delimited). Do **not** use plain `.csv` unless you convert to tab-delimited per Google’s help.
4. Use **`mc-local-inventory-template.tsv`** from this repo (tab-separated). It includes **`price`** and uses **`in_stock`** (underscore — **not** `in stock` with a space; wrong availability text often results in **0 products** processed).
5. When creating the source, pick type **Local inventory** / **Local product inventory** — not a normal “products” primary feed.
6. **Fetch** / wait for processing. The feed’s **Products** count should become **1** (or more). If it stays **0**, open the feed → **Diagnostics** / **Issues** for the error row.

### 3. Common mistakes

| Problem | Fix |
|--------|-----|
| `id` does not match primary feed | Use the **same** offer id as in your product feed (including upper/lower case). |
| Wrong `store_code` | Must match linked Business Profile store code **exactly**. |
| Feed shows **0 products** after upload | Wrong delimiter (must be **tab**), wrong feed type, or bad **`availability`** value — use **`in_stock`** not `in stock`. Open feed **Issues** for the exact error. |
| No Business Profile linked | Link stores under **Business information** → **Stores**. |
| Products opted into local but not sold in store | Either add inventory rows **or** adjust **marketing methods** / program so online-only items are not required to have store inventory (see Google’s “Physical store marketing methods” in feed **Source settings**). |

Official help: [Troubleshoot local product data](https://support.google.com/merchants/topic/7293661) (search “missing inventory data” on Merchant Center Help).

## Merchant Center product links

Current product URL (matches `sku` in `data/products.json`):

`https://sanders-peach.vercel.app/product.html?sku=JAMESON-IRISH-WHISKEY-200ML`

## Local preview

```bash
python -m http.server 8080
```

Open http://localhost:8080/

After deploy, test in Search Console **URL Inspection** and the [Rich Results Test](https://search.google.com/test/rich-results).
