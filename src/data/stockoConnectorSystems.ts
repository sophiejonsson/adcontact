// Stocko "Connector Systems" series, sourced from the manufacturer's own site
// (stocko-contact.com) — these series are not imported into the Magento
// catalogue (0 products under every Connector Systems sub-category), so this
// reference data powers a dedicated partner-style browse page instead of the
// usual product-backed category cards. See StockoConnectorSystemsPage.

export type StockoConnectorSeries = {
  name: string;
  /** Manufacturer product page, opened in a new tab. */
  url: string;
  /** Local copy of the manufacturer's product image. */
  image: string;
};

export type StockoConnectorPitchGroup = {
  /** Display label, e.g. "Pitch 2.5 mm". */
  pitch: string;
  /** Matching Magento sub-category route, if one exists, for breadcrumb/card linking. */
  categoryRoute?: string;
  series: StockoConnectorSeries[];
};

export const STOCKO_CONNECTOR_SYSTEMS_CATEGORY_ID = 125;

export const STOCKO_CONNECTOR_SYSTEMS_ROUTE =
  "/webshop/components/sealed-connectors/stocko/connector-systems.html";

export const STOCKO_PARTNER_URL = "https://www.stocko-contact.com/en/products-connector-systems.php";

export const stockoConnectorSystems: StockoConnectorPitchGroup[] = [
  {
    pitch: "Pitch 1.27 mm",
    series: [
      {
        name: "S-LINX 1.27 D",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-1.27-mm-s-linx-1.27-d.php",
        image: "/images/stocko/connector-systems/s-linx-1-27-d.jpg",
      },
    ],
  },
  {
    pitch: "Pitch 1.5 mm",
    series: [
      {
        name: "S-TECX 1.5",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-1.5-mm-s-tecx-1.5.php",
        image: "/images/stocko/connector-systems/s-tecx-1-5.jpg",
      },
    ],
  },
  {
    pitch: "Pitch 2.5 mm",
    categoryRoute: "/webshop/components/sealed-connectors/stocko/connector-systems/pitch-2-5mm.html",
    series: [
      {
        name: "RFK 2",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-2.5-mm-rfk-2.php",
        image: "/images/stocko/connector-systems/rfk-2.jpg",
      },
      {
        name: "ECO-TRONIC",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-2.5-mm-eco-tronic.php",
        image: "/images/stocko/connector-systems/eco-tronic.jpg",
      },
      {
        name: "ECO-TRONIC CRIMP",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-2.5-mm-eco-tronic-crimp.php",
        image: "/images/stocko/connector-systems/eco-tronic-crimp.jpg",
      },
      {
        name: "ECO-TRONIC SPM",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-2.5-mm-eco-tronic-spm.php",
        image: "/images/stocko/connector-systems/eco-tronic-spm.jpg",
      },
      {
        name: "ECO-TRONIC FB",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-2.5-mm-eco-tronic-fb.php",
        image: "/images/stocko/connector-systems/eco-tronic-fb.jpg",
      },
      {
        name: "ECO-TRONIC IMS",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-2.5-mm-eco-tronic-ims.php",
        image: "/images/stocko/connector-systems/eco-tronic-ims.jpg",
      },
    ],
  },
  {
    pitch: "Pitch 2.54 mm",
    categoryRoute: "/webshop/components/sealed-connectors/stocko/connector-systems/pitch-2-54-mm.html",
    series: [
      {
        name: "S-GRID 2.54",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-2.54-mm-s-grid.php",
        image: "/images/stocko/connector-systems/s-grid-2-54.jpg",
      },
    ],
  },
  {
    pitch: "Pitch 3.5 mm",
    categoryRoute: "/webshop/components/sealed-connectors/stocko/connector-systems/pitch-3-5mm.html",
    series: [
      {
        name: "HLK 3500",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-3.5-mm-hlk-3500.php",
        image: "/images/stocko/connector-systems/hlk-3500.jpg",
      },
    ],
  },
  {
    pitch: "Pitch 4.2 mm",
    categoryRoute: "/webshop/components/sealed-connectors/stocko/connector-systems/pitch-4-2mm.html",
    series: [
      {
        name: "S-FIT 4.20",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-4.2-mm-s-fit-4.20.php",
        image: "/images/stocko/connector-systems/s-fit-4-20.jpg",
      },
    ],
  },
  {
    pitch: "Pitch 5 mm",
    categoryRoute: "/webshop/components/sealed-connectors/stocko/connector-systems/pitch-5mm.html",
    series: [
      {
        name: "ECO-DOMO NF",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-5-mm-eco-domo-nf.php",
        image: "/images/stocko/connector-systems/eco-domo-nf.jpg",
      },
      {
        name: "ECO-DOMO PM",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-5-mm-eco-domo-pm.php",
        image: "/images/stocko/connector-systems/eco-domo-pm.jpg",
      },
      {
        name: "ECO-DOMO TI",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-5-mm-eco-domo-ti.php",
        image: "/images/stocko/connector-systems/eco-domo-ti.jpg",
      },
      {
        name: "ECO-FLEX M",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-5-mm-eco-flex-m.php",
        image: "/images/stocko/connector-systems/eco-flex-m.jpg",
      },
      {
        name: "ECO-FLEX ML",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-5-mm-eco-flex-ml.php",
        image: "/images/stocko/connector-systems/eco-flex-ml.jpg",
      },
      {
        name: "ECO-FLEX BL",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-5-mm-eco-flex-bl.php",
        image: "/images/stocko/connector-systems/eco-flex-bl.jpg",
      },
      {
        name: "ECO-FLEX MBL",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-5-mm-eco-flex-mbl.php",
        image: "/images/stocko/connector-systems/eco-flex-mbl.jpg",
      },
      {
        name: "ECO-TRONIC pro",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-5-mm-eco-tronic-pro.php",
        image: "/images/stocko/connector-systems/eco-tronic-pro.jpg",
      },
      {
        name: "ECO-DOMO Crimp",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-5-mm-eco-domo-crimp.php",
        image: "/images/stocko/connector-systems/eco-domo-crimp.jpg",
      },
      {
        name: "WIECON 8105",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-5-mm-wiecon-8105.php",
        image: "/images/stocko/connector-systems/wiecon-8105.jpg",
      },
    ],
  },
  {
    pitch: "Pitch 5.08 mm",
    categoryRoute: "/webshop/components/sealed-connectors/stocko/connector-systems/pitch-5-08mm.html",
    series: [
      {
        name: "S-CON 5.08",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-5.08-mm-s-con-5.08.php",
        image: "/images/stocko/connector-systems/s-con-5-08.jpg",
      },
    ],
  },
  {
    pitch: "Pitch 5.08 / 7.62 mm",
    categoryRoute: "/webshop/components/sealed-connectors/stocko/connector-systems/pitch-5-08-7-62-mm.html",
    series: [
      {
        name: "MKH 2800",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-5.08-7.62-mm-mkh-2800.php",
        image: "/images/stocko/connector-systems/mkh-2800.jpg",
      },
    ],
  },
  {
    pitch: "Pitch 6.35 mm",
    categoryRoute: "/webshop/components/sealed-connectors/stocko/connector-systems/pitch-6-35-mm.html",
    series: [
      {
        name: "S-LOCK 6.35",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-6.35-mm-s-lock-6.35.php",
        image: "/images/stocko/connector-systems/s-lock-6-35.jpg",
      },
    ],
  },
  {
    pitch: "Pitch 6.5 mm",
    categoryRoute: "/webshop/components/sealed-connectors/stocko/connector-systems/pitch-6-5-mm.html",
    series: [
      {
        name: "Sensor Plug",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-6.5-mm-sensor-plug.php",
        image: "/images/stocko/connector-systems/sensor-plug.jpg",
      },
    ],
  },
  {
    pitch: "Pitch 8 mm",
    categoryRoute: "/webshop/components/sealed-connectors/stocko/connector-systems/pitch-8-mm.html",
    series: [
      {
        name: "TL 3",
        url: "https://www.stocko-contact.com/en/products-connector-system-pitch-8-mm-tl-3-ht.php",
        image: "/images/stocko/connector-systems/tl-3.jpg",
      },
    ],
  },
  {
    pitch: "Circular Connector",
    categoryRoute: "/webshop/components/sealed-connectors/stocko/connector-systems/pitch-11-4-mm.html",
    series: [
      {
        name: "Circular Connector",
        url: "https://www.stocko-contact.com/en/products-connector-system-circular-connector.php",
        image: "/images/stocko/connector-systems/circular-connector.jpg",
      },
    ],
  },
  {
    pitch: "Pin strips",
    categoryRoute: "/webshop/components/sealed-connectors/stocko/connector-systems/pin-strips.html",
    series: [
      {
        name: "Pin strips",
        url: "https://www.stocko-contact.com/en/products-connector-system-pin-strips.php",
        image: "/images/stocko/connector-systems/pin-strips.jpg",
      },
    ],
  },
];

export const stockoSeriesCount = stockoConnectorSystems.reduce(
  (sum, group) => sum + group.series.length,
  0,
);

/** { value, count } pitch options for the product browser's sidebar facet.
 *  Lives here (not in the client browser component) so server components can
 *  build the facet without pulling in a client module. */
export function stockoPitchOptions(groups: StockoConnectorPitchGroup[]) {
  return groups.map((g) => ({ value: g.pitch, count: g.series.length }));
}

export function getStockoPitchGroupByCategoryRoute(
  route: string,
): StockoConnectorPitchGroup | undefined {
  return stockoConnectorSystems.find((group) => group.categoryRoute === route);
}
