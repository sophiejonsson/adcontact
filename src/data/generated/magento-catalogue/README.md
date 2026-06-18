# Generated Magento Catalogue

Generated data for the native catalogue rebuild.

Do not edit these JSON files by hand. Regenerate them from the Magento MariaDB
dump with:

```bash
MAGENTO_SOCKET=/tmp/adcontact-mariadb.sock MAGENTO_USER=root npm run export:magento-catalogue
```

Files:

- `summary.json` - counts and export metadata.
- `routes.json` - SEO-critical map from preserved URL path to entity.
- `categories.json` - normalized category tree and listing memberships.
- `products.json` - normalized product details, attributes, images, files, and
  all preserved product routes.
