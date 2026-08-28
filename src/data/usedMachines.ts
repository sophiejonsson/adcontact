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
  /** Manufacturer's own product page, for general capability description. */
  referenceUrl?: string;
};

export const usedMachines: UsedMachine[] = [
  {
    id: "komax-gamma-450-450-0231",
    slug: "komax-gamma-450-450-0231",
    brand: "Komax",
    model: "Gamma 450",
    // ⚠️ Best-guess pairing — the source document didn't explicitly label
    // which configuration list belongs to which serial number, only that
    // there are 3 Gamma 450 units (450.0231, 450.0259, and a third). This is
    // the first config list in reading order, paired with the first serial
    // number mentioned. CONFIRM before this goes live.
    serialNumber: "450.0231",
    photos: [],
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
