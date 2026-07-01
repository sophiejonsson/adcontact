// Stocko "Terminating Technology" (automated crimping machines), sourced from
// the manufacturer's own site (stocko-contact.com). These are not Magento
// products. The data powers a dedicated browse page for category 171 and its
// sub-categories (ids 214–220 mapped here; 215, 221–225 are on separate pages
// not yet crawled).

export type StockoMachine = {
  /** Model number shown on card, e.g. "WT 165.9" */
  model: string;
  /** Full display name */
  name: string;
  /** Manufacturer product page */
  url: string;
  /** Local copy of manufacturer image */
  image: string;
};

export type StockoMachineGroup = {
  /** Short group label, e.g. "ECO-TRONIC professional line" */
  name: string;
  /** Full STOCKOMAT name for display */
  fullName: string;
  /** Matching Magento sub-category route, if one exists */
  categoryRoute?: string;
  machines: StockoMachine[];
};

export const STOCKO_TERMINATING_TECHNOLOGY_CATEGORY_ID = 171;

export const STOCKO_TERMINATING_TECHNOLOGY_ROUTE =
  "/webshop/components/sealed-connectors/stocko/terminating-technology.html";

export const STOCKO_TERM_PARTNER_URL =
  "https://www.stocko-contact.com/en/products-terminating-technology.php";

export const stockoMachineGroups: StockoMachineGroup[] = [
  {
    name: "ECO-TRONIC professional line",
    fullName: "STOCKOMAT ECO-TRONIC professional line",
    categoryRoute:
      "/webshop/components/sealed-connectors/stocko/terminating-technology/stockomat-eco-tronic-professional-line.html",
    machines: [
      {
        model: "WT 165.9",
        name: "STOCKOMAT ECO-TRONIC professional line | WT 165.9",
        url: "https://www.stocko-contact.com/en/products-terminating-technology-stockomat-eco-tronic-professional-line-wt-165.9.php",
        image: "/images/stocko/terminating-technology/stockomat-eco-tronic-professional-line-wt-165-9.jpg",
      },
    ],
  },
  {
    name: "ECO-DOMO professional line",
    fullName: "STOCKOMAT ECO-DOMO professional line",
    categoryRoute:
      "/webshop/components/sealed-connectors/stocko/terminating-technology/stockomat-eco-domo-professional-line.html",
    machines: [
      {
        model: "WT 155",
        name: "STOCKOMAT ECO-DOMO professional line | WT 155",
        url: "https://www.stocko-contact.com/en/products-terminating-technology-stockomat-eco-domo-professional-line-wt-155.php",
        image: "/images/stocko/terminating-technology/stockomat-eco-domo-professional-line-wt-155.jpg",
      },
    ],
  },
  {
    name: "ECO-DOMO economy line",
    fullName: "STOCKOMAT ECO-DOMO economy line",
    categoryRoute:
      "/webshop/components/sealed-connectors/stocko/terminating-technology/stockomat-eco-domo-economy-line.html",
    machines: [
      {
        model: "WT 255",
        name: "STOCKOMAT ECO-DOMO economy line | WT 255",
        url: "https://www.stocko-contact.com/en/products-terminating-technology-stockomat-eco-domo-economy-line-wt-255.php",
        image: "/images/stocko/terminating-technology/stockomat-eco-domo-economy-line-wt-255.jpg",
      },
    ],
  },
  {
    name: "ECO-TRONIC/ECO-DOMO economy line",
    fullName: "STOCKOMAT ECO-TRONIC economy line",
    categoryRoute:
      "/webshop/components/sealed-connectors/stocko/terminating-technology/stockomat-eco-tronic-eco-domo-economy-line.html",
    machines: [
      {
        model: "WT 365",
        name: "STOCKOMAT ECO-TRONIC economy line | WT 365",
        url: "https://www.stocko-contact.com/en/products-terminating-technology-stockomat-eco-tronic-economy-line-wt-365.php",
        image: "/images/stocko/terminating-technology/stockomat-eco-tronic-economy-line-wt-365.jpg",
      },
    ],
  },
  {
    name: "ECO-TRONIC Panel Mount xtra line",
    fullName: "STOCKOMAT ECO-TRONIC Panel Mount xtra line",
    categoryRoute:
      "/webshop/components/sealed-connectors/stocko/terminating-technology/stockomat-eco-tronic-panel-mount-xtra-line.html",
    machines: [
      {
        model: "WT 370",
        name: "STOCKOMAT ECO-TRONIC Panel Mount xtra line | WT 370",
        url: "https://www.stocko-contact.com/en/products-terminating-technology-stockomat-eco-tronic-panel-mount-xtra-line-wt-370.php",
        image: "/images/stocko/terminating-technology/stockomat-eco-tronic-panel-mount-xtra-line-wt-370.jpg",
      },
    ],
  },
  {
    name: "ECO-TRONIC Daisy Chain xtra line",
    fullName: "STOCKOMAT ECO-TRONIC Daisy Chain xtra line",
    categoryRoute:
      "/webshop/components/sealed-connectors/stocko/terminating-technology/stockomat-eco-tronic-daisy-chain-xtra-line.html",
    machines: [
      {
        model: "WT 375",
        name: "STOCKOMAT ECO-TRONIC Daisy Chain xtra line | WT 375",
        url: "https://www.stocko-contact.com/en/products-terminating-technology-stockomat-eco-tronic-daisy-chain-xtra-line-wt-375.php",
        image: "/images/stocko/terminating-technology/stockomat-eco-tronic-daisy-chain-xtra-line-wt-375.jpg",
      },
    ],
  },
];

export const stockoMachinesCount = stockoMachineGroups.reduce(
  (sum, g) => sum + g.machines.length,
  0,
);

export function getStockoMachineGroupByCategoryRoute(
  route: string,
): StockoMachineGroup | undefined {
  return stockoMachineGroups.find((g) => g.categoryRoute === route);
}
