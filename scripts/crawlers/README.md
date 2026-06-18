# Legacy Crawlers

One-off and repeatable crawlers used to capture legacy catalogue details from
the old Adcontact storefront.

These scripts are useful for filling gaps and validating the SQL-derived
catalogue, but the primary catalogue source is now the Magento export pipeline
in `scripts/catalogue/`.

Run from the repo root through npm scripts where available:

```bash
npm run crawl:deutsch
npm run crawl:related
npm run crawl:featured
```
