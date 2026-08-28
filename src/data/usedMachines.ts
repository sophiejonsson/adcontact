export type UsedMachineConfigItem = {
  partNumber: string;
  description: string;
  quantity: number;
};

export type UsedMachine = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  serialNumber: string;
  /** Undefined = "ask Stefan" fields not filled in yet — the detail page shows
   *  these as "On request" rather than fabricating a value. */
  productionYear?: number;
  productionCycles?: string;
  price?: string;
  deliveryTerms?: string;
  warranty?: string;
  paymentTerms?: string;
  conditionNotes?: string;
  /** The real as-built configuration for this specific unit (from the
   *  supplier's own export), not a generic spec sheet. */
  configuration: UsedMachineConfigItem[];
  /** Items that appear on the supplier's sheet but are NOT actually included
   *  (e.g. crossed out as no longer available) — shown separately so nobody
   *  mistakes them for part of what's for sale. */
  excludedItems?: UsedMachineConfigItem[];
  /** R2 paths, e.g. /media/used-machines/<slug>/1.jpg. Empty until Stefan
   *  uploads real photos of the physical unit. */
  photos: string[];
  /** True when `photos` are the manufacturer's own marketing photos (used as
   *  a stand-in before real photos of the physical unit exist) rather than
   *  photos of the actual unit for sale — the detail page shows a caption
   *  making this explicit so nobody mistakes it for the real unit's condition. */
  photosAreReference?: boolean;
  /** Manufacturer's own product page, for general capability description. */
  referenceUrl?: string;
};

/**
 * General (non-unit-specific) manufacturer description per model — shared by
 * every individual unit of that model rather than duplicated per entry.
 * Keyed by "Brand Model". Extracted from the manufacturer's own product page
 * (Claude does this per model going forward — no need for Stefan to paste it
 * into the per-machine doc; the short version goes on the grid card, the long
 * version to the left of the price box on the detail page). Deliberately no
 * read-more/less collapse — full text always shown (Stefan's call: B2B buyers
 * want all available info up front).
 */
export const MACHINE_MODEL_DESCRIPTIONS: Record<string, { short: string; long: string }> = {
  "Komax Gamma 450": {
    short:
      "Gamma 450 – the compact, fully automatic wire processing machine – processes crimps and seals on both sides with a wire cross section of 0.13–4 mm².",
    long: "The fully automatic Gamma 450 wire processing machine is a compact device for its performance. Thanks to fully integrated, seamless quality monitoring with CFA/CFA+, ACD and Q1250 and optional modules, it can be adapted to high and future-oriented requirements. By individually configuring the machine at four stations, the processes can be set up to meet the respective needs. This makes the Gamma 450 particularly suitable for the automotive industry and its changing requirements for durable machines. The ergonomic design, logical workflows and simple user guidance increase economic efficiency. Terminal reels and crimp tools can also be replaced during operation thanks to the STC tool and terminal reel quick changer.",
  },
};

export function getModelDescription(brand: string, model: string) {
  return MACHINE_MODEL_DESCRIPTIONS[`${brand} ${model}`];
}

export const usedMachines: UsedMachine[] = [
  {
    id: "komax-gamma-450-450-0231",
    slug: "komax-gamma-450-450-0231",
    brand: "Komax",
    model: "Gamma 450",
    // Pairing confirmed 2026-08-28 — Stefan's dedicated per-machine doc for
    // this unit is filed as "Gamma 450_SN_450-0231.docx", matching the guess.
    serialNumber: "450.0231",
    productionYear: 2023,
    productionCycles: "Only a test run — never used in production",
    price: "125,000 EUR",
    deliveryTerms: "Excl. freight, installation and training",
    conditionNotes:
      "Only run as a factory test — never put into production use. Configuration change from the original build sheet: part 0045589 (V-blade R=1.00) has been removed and replaced with part 0341028.",
    photos: ["/media/used-machines/komax-gamma-450/reference.png"],
    photosAreReference: true,
    referenceUrl:
      "https://www.komaxgroup.com/en/products/wire-processing/higher-automation-platforms/automatic-crimping/gamma-450",
    configuration: [
      { partNumber: "0373000", description: "Wire processing machine Gamma 450", quantity: 1 },
      { partNumber: "0045589", description: "V-blade R=1.00", quantity: 4 },
      { partNumber: "0045592", description: "V-blade R=0.50", quantity: 4 },
      { partNumber: "0045593", description: "V-blade R=0.50 upper", quantity: 1 },
      { partNumber: "0045603", description: "V-blade R=0.50 lower", quantity: 1 },
      { partNumber: "0073449", description: "V-blade R=0.50", quantity: 2 },
      { partNumber: "0338322", description: "Terminal feed back feed Backfeed compl.", quantity: 1 },
      { partNumber: "0338322", description: "Terminal feed back feed Backfeed compl.", quantity: 1 },
      { partNumber: "0341310", description: "Deposit gripper c/w A530 / G450", quantity: 1 },
      { partNumber: "0341549", description: "Blade block cpl. dual blade lines A5xx", quantity: 1 },
      { partNumber: "0348928", description: "Crimp height measuring device Komax 341 to Alpha 5xx", quantity: 1 },
      { partNumber: "0350362", description: "Air feed set", quantity: 2 },
      { partNumber: "0373252", description: "Wire deposit basic module 2m cpl G4xx", quantity: 1 },
      { partNumber: "0375782", description: "Case tools G4xx", quantity: 1 },
      { partNumber: "0376808", description: "Options set Transformator 400V cpl", quantity: 1 },
      { partNumber: "0377782", description: "Terminal feed left feed active G450", quantity: 1 },
      { partNumber: "0377782", description: "Terminal feed left feed active G450", quantity: 1 },
      { partNumber: "0379198", description: "Pressure regulator set STC / G450", quantity: 2 },
      { partNumber: "0379822", description: "License Komax HMI software maintenance 3 years", quantity: 1 },
      { partNumber: "0385974", description: "Terminal strip chopper C1360", quantity: 2 },
      { partNumber: "0387000", description: "Crimp module C1360", quantity: 1 },
      { partNumber: "0387000", description: "Crimp module C1360", quantity: 1 },
      { partNumber: "0393874", description: "Straightener unit box cpl. standard G4xx", quantity: 1 },
      { partNumber: "0397946", description: "Safety cover cpl. with writting Gamma 450", quantity: 1 },
      { partNumber: "0398811", description: "Straightener unit standard w.cable diameter disp", quantity: 1 },
      { partNumber: "0404277", description: "Network product Komax Gateway N3000", quantity: 1 },
      { partNumber: "0404376", description: "Mounting set", quantity: 1 },
      { partNumber: "0417132", description: "License set Komax HMI network and workflow", quantity: 1 },
    ],
  },
];

export function getUsedMachine(slug: string): UsedMachine | undefined {
  return usedMachines.find((m) => m.slug === slug);
}
