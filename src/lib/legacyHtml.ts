export function normalizeLegacyHtml(html: string) {
  return html
    .replace(/\{\{media url="([^"]+)"\}\}/g, "/media/$1")
    .replace(/\{\{media url='([^']+)'\}\}/g, "/media/$1")
    .replace(/https?:\/\/(?:www\.)?adcontact\.se(?=\/)/gi, "")
    .replace(/(["'])\/?media\//g, "$1/media/");
}

/** Strip HTML tags from a Magento short description and return readable plain text. */
export function stripLegacyHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Some Magento exports have a bare `&nbsp` with no trailing semicolon —
    // a malformed-but-common entity that the semicolon-only pattern below
    // wouldn't otherwise catch, leaving the literal text "&nbsp" visible on
    // ~1,700 product pages (junk-only "descriptions" that were really just
    // an empty WYSIWYG paragraph).
    .replace(/&nbsp;?/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Strip inline `style="..."` attributes from a legacy Magento HTML fragment
 * before rendering it with dangerouslySetInnerHTML. Some attribute values
 * (e.g. a "Drawing" link) carry the old site's inline styling (commonly a
 * jarring `color: rgb(255,0,0)` red), which — being inline — overrides our
 * own link styling no matter what CSS classes wrap it. Keeps the markup
 * (the `<a href>` itself), only drops the style attribute.
 */
export function stripInlineStyles(html: string): string {
  return html.replace(/\sstyle\s*=\s*(".*?"|'.*?')/gi, "");
}
