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
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
