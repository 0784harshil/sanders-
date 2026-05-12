If Google Merchant Center asks you to verify using an HTML file upload:

1. Download the verification file from Google (name looks like googleXXXX.html).
2. Place that file in THIS (.well-known) folder OR at the website root next to index.html.
3. Redeploy. Open https://YOUR-DOMAIN.COM/googleXXXX.html — it must return HTTP 200.

Alternatively paste the meta tag into data/site.json → google_site_verification (recommended for this template).
