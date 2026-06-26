// Curated DEUTSCH connector series content, transcribed from the original
// Adcontact "DT Series" slideshow banners. The `name` of each entry matches
// the product "Series" attribute value so cards can be enriched with live
// product counts and linked to the filtered catalogue view.

export type DeutschSeriesInfo = {
  /** Must match the product "Series" attribute value exactly. */
  name: string;
  /** Optional short positioning line when key features aren't available. */
  blurb?: string;
  /** Key features as shown on the original banners. */
  features?: string[];
};

// Only rendered on this catalogue category.
export const DEUTSCH_SERIES_CATEGORY_ROUTE =
  "/webshop/components/sealed-connectors/deutsch.html";

export const DEUTSCH_SERIES_INTRO =
  "DEUTSCH industrial environmentally sealed electrical connectors are built for critical applications, designed to withstand the harshest and most challenging environments.";

export const deutschSeries: DeutschSeriesInfo[] = [
  {
    name: "DT Series",
    features: ["Contact size 16 (13 A)", "14–20 AWG", "2, 3, 4, 6, 8 & 12-cavity arrangements"],
  },
  {
    name: "DTM Series",
    features: ["Contact size 20 (7.5 A)", "16–22 AWG", "2, 3, 4, 6, 8 & 12-cavity arrangements"],
  },
  {
    name: "DTP Series",
    features: ["Contact size 12 (25 A)", "10–14 AWG", "2 & 4-cavity arrangements"],
  },
  {
    name: "DTHD Series",
    features: ["Contact sizes 4 (100 A), 8 (60 A) & 12 (25 A)", "6–14 AWG", "1-cavity arrangement"],
  },
  {
    name: "DTV Series",
    features: ["Contact size 16 (13 A)", "14–20 AWG", "18-cavity arrangement", "Flange mount"],
  },
  {
    name: "DRC Series",
    features: [
      "Contact sizes 16 (13 A) & 20 (7.5 A)",
      "14–22 AWG",
      "24, 38, 40, 50, 60, 64, 70 & 80-cavity arrangements",
    ],
  },
  {
    name: "DRB Series",
    features: [
      "Contact sizes 4 (100 A) through 20 (7.5 A)",
      "6–22 AWG",
      "48, 60, 102 & 128-cavity arrangements",
    ],
  },
  {
    name: "HD10 Series",
    features: [
      "Contact sizes 4 (100 A), 12 (25 A) & 16 (13 A)",
      "6–20 AWG",
      "3, 4, 5, 6 & 9-cavity arrangements",
    ],
  },
  {
    name: "HD30 Series",
    features: [
      "Contact sizes 4 (100 A) through 20 (7.5 A)",
      "6–22 AWG",
      "2 to 47-cavity arrangements",
    ],
  },
  {
    name: "HDP20 Series",
    features: [
      "Contact sizes 4 (100 A) through 20 (7.5 A)",
      "4–22 AWG",
      "2 to 47-cavity arrangements",
    ],
  },
  {
    name: "AEC Series",
    features: ["Contact size 16 (13 A)", "14–20 AWG", "40-cavity arrangement"],
  },
  {
    name: "STRIKE Series",
    features: ["Contact sizes 16 (13 A) & 20 (7.5 A)", "14–20 AWG", "32 & 64-cavity arrangements"],
  },
  {
    name: "EEC",
    features: [
      "Through-hole mounting flange on each side",
      "Headers accept one or more DT/DTM interfaces",
      "90° header pins",
    ],
  },
  {
    name: "Jiffy Splice",
    features: ["Contact sizes 4 (100 A), 12 (25 A) & 16 (13 A)", "6–20 AWG", "1-cavity arrangement"],
  },
  // AMPSEAL and AMPSEAL 16 are TE Connectivity series, not part of the DEUTSCH
  // series family, so they are intentionally excluded here and filtered out of
  // the "Browse by series" facets in CatalogueCategoryPage.
];

export const deutschSeriesByName = new Map(
  deutschSeries.map((series) => [series.name, series]),
);
