import cviluxData from "@/data/generated/cvilux-catalogue.json";
import { buildFlatCatalogue } from "@/data/brandCatalogueFlat";

const TAGLINES: Record<string, string> = {
  "Wire To Board Connector": "Crimp and IDC wire-to-board connectors for PCB assembly.",
  "Board to Board Connector": "Headers and sockets for board-to-board stacking.",
  "FFC/FPC Connector": "Connectors for flat flexible cable and flexible printed circuits.",
  "I/O Connector": "D-SUB, USB, RJ45, DVI and other external I/O connectors.",
  "Power Connector": "Board-mount and crimp power connectors.",
  "IC Socket": "IC sockets and shunts for board assembly.",
  "Application Tooling": "Desk-top machines and hand tools for crimp termination.",
  "CCFL Connector": "Connectors for CCFL backlight assemblies.",
  "LVDS Connector": "Connectors for LVDS display interfaces.",
};

const flat = buildFlatCatalogue(cviluxData, {
  webshopPrefix: "/webshop/components/sealed-connectors/cvilux",
  taglines: TAGLINES,
});

export const cviluxProducts = flat.products;
export const cviluxProductAttributes = flat.productAttributes;
export const cviluxFilterAttributes = flat.filterAttributes;
export const cviluxOverviewCards = flat.overviewCards;
