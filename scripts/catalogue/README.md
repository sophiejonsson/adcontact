# Catalogue Scripts

Durable scripts for turning legacy Magento data into the native Adcontact
catalogue used by the Next.js app.

## Scripts

- `export-magento-catalogue.mjs` - reads a loaded MariaDB copy of the Magento
  dump and writes normalized route, category, and product JSON files to
  `src/data/generated/magento-catalogue/`.

Run from the repo root:

```bash
MAGENTO_SOCKET=/tmp/adcontact-mariadb.sock MAGENTO_USER=root npm run export:magento-catalogue
```
