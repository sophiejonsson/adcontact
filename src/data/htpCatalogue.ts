import htpData from "@/data/generated/htp-catalogue.json";
import { buildFlatCatalogue } from "@/data/brandCatalogueFlat";

const TAGLINES: Record<string, string> = {
  "M8 Circular Connectors": "Compact sealed circular connectors for sensors and actuators.",
  "M12 Circular Connectors": "A, B, D, S, T and X-coded connectors for fieldbus, Ethernet and power.",
  "M23 Circular Connectors": "Higher pin-count circular connectors for signal and power.",
  'M9 Circular Connectors': "Compact circular connectors for specialised signal applications.",
  '7/8"': "Rugged power connectors for industrial distribution.",
  "EN 175301-803 (ex DIN 43650)": "Valve and solenoid connectors to EN 175301-803.",
  "Automotive connectors": "Sealed connectors for automotive and transportation wiring.",
  "Industrial connectors": "Heavy-duty connectors for industrial installations.",
  "Distribution boxes M8/M12": "Passive distribution boxes for sensor/actuator wiring.",
  "MIL-C5015 Style CONNECTORS": "Rugged MIL-C5015-style circular connectors.",
  "Magnetic sensor": "Reed and magneto-resistive magnetic sensors.",
  "Fuse Holder": "Inline and panel fuse holders.",
  "En 175 000": "Connectors to the EN 175 000 standard.",
  Accessories: "Caps, clips, cable ties and mounting accessories.",
};

const flat = buildFlatCatalogue(htpData, {
  webshopPrefix: "/webshop/components/sealed-connectors/htp",
  taglines: TAGLINES,
});

export const htpProducts = flat.products;
export const htpProductAttributes = flat.productAttributes;
export const htpFilterAttributes = flat.filterAttributes;
export const htpOverviewCards = flat.overviewCards;
