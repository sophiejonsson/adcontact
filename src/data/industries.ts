export type Industry = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  challenges: string[];
  solutions: string[];
  icon: string;
  keyProducts: string[];
};

export const industries: Industry[] = [
  {
    id: "white-goods",
    name: "White Goods & Appliances",
    slug: "white-goods",
    shortDescription:
      "High-volume, high-reliability components for washing machines, dishwashers, refrigerators, and HVAC.",
    description:
      "White goods production demands precise, reliable components at scale. Temperature resistance, vibration tolerance, and RoHS compliance are non-negotiable. Adcontact supplies leading European appliance OEMs with connectors, terminals, ferrules, and heat shrink from proven manufacturers like Stocko and TE Connectivity.",
    challenges: [
      "Cost pressure in high-volume production",
      "RoHS and REACH compliance requirements",
      "Vibration and temperature resistance in connectors",
      "Consistent supply chain reliability",
    ],
    solutions: [
      "Stocko IDC and crimp connector systems for appliance wiring",
      "HongShang heat shrink for wire protection and bundling",
      "Ulmer ferrules for control panel termination",
      "Production equipment for high-throughput wire processing",
    ],
    icon: "Refrigerator",
    keyProducts: ["Stocko connectors", "Heat shrink tubing", "Wire ferrules", "Crimp contacts"],
  },
  {
    id: "automotive",
    name: "Automotive & Transportation",
    slug: "automotive",
    shortDescription:
      "AEC-Q qualified connectors, sealed housings, and wire processing solutions for vehicle wiring harnesses.",
    description:
      "Automotive wiring demands sealed, vibration-proof, temperature-stable connections across hundreds of connectors per vehicle. We supply DEUTSCH sealed connectors, TE Connectivity AMP and MCON systems, automotive-grade crimp contacts, and wire processing equipment certified for automotive production environments.",
    challenges: [
      "Harsh thermal cycling: -40°C to +150°C",
      "High vibration environments",
      "Sealed IP67/IP69K requirements",
      "Traceability and quality documentation",
    ],
    solutions: [
      "DEUTSCH DT/DTM sealed connector systems",
      "TE Connectivity MQS and MCON automotive contacts",
      "Zoller & Fröhlich wire cutting and stripping machines",
      "Mecal crimp press with integrated quality monitoring",
    ],
    icon: "Car",
    keyProducts: ["DEUTSCH connectors", "Automotive crimp contacts", "Sealed M12 connectors", "Crimping equipment"],
  },
  {
    id: "electronics",
    name: "Electronics Manufacturing",
    slug: "electronics",
    shortDescription:
      "Fine-pitch contacts, PCB connectors, soldering tags, and SMD-compatible terminals for electronics OEMs.",
    description:
      "Electronics assembly requires precision components at tight tolerances. Adcontact supplies PCB contacts, soldering tags, board-to-board connectors, and SMD terminals from Vogt, TE Connectivity, and Cvilux for industrial electronics, instrumentation, and LED lighting manufacturers.",
    challenges: [
      "Fine-pitch and SMD-compatible termination",
      "Lead-free (RoHS) solder compatibility",
      "PCB real estate constraints",
      "Mixed through-hole and SMT assembly",
    ],
    solutions: [
      "Vogt turret and bifurcated PCB contacts",
      "Cvilux wire-to-board connectors",
      "TE press-fit PCB contacts",
      "HongShang PVDF high-temperature heat shrink",
    ],
    icon: "Cpu",
    keyProducts: ["PCB contacts", "Soldering tags", "Wire-to-board connectors", "PVDF heat shrink"],
  },
  {
    id: "wire-harness",
    name: "Wire Harness Processing",
    slug: "wire-harness",
    shortDescription:
      "Complete wire-processing line solutions: from raw wire to finished harness with quality assurance.",
    description:
      "Wire harness manufacturers need reliable, fast, and measurable processes. Adcontact is one of the few suppliers in the Nordics combining component supply with complete wire-processing machinery, cutting, stripping, crimping, ultrasonic welding, and electrical test, from a single source.",
    challenges: [
      "Production cycle time reduction",
      "Crimp quality consistency across shifts",
      "Mixed wire gauges on a single line",
      "Quality documentation and traceability",
    ],
    solutions: [
      "Mecal and Zoller & Fröhlich automatic wire processors",
      "Branson ultrasonic splice welders",
      "Inline crimp force monitoring systems",
      "Electrical continuity test systems",
    ],
    icon: "Cable",
    keyProducts: ["Cutting machines", "Stripping machines", "Crimp presses", "Ultrasonic welders", "Test systems"],
  },
  {
    id: "industrial-automation",
    name: "Industrial Automation",
    slug: "industrial-automation",
    shortDescription:
      "Control cabinet wiring components, M8/M12 field connectors, and machine wiring solutions.",
    description:
      "Industrial automation environments combine EMC-sensitive control systems, high-current power distribution, and IP67-rated field devices. Adcontact supplies M8/M12 sensor connectors, control cabinet wiring ferrules, terminal blocks, and cable management products for automation OEMs and system integrators.",
    challenges: [
      "IP67/IP69K field device connectivity",
      "EMC shielding and continuity",
      "Mixed signal and power in tight cabinets",
      "Fast on-site termination",
    ],
    solutions: [
      "M12 A/B/D-coded connectors for Profibus, DeviceNet, Ethernet",
      "Ulmer wire ferrules for precise screw terminal termination",
      "TE Connectivity CPC connectors for control cabinet",
      "Cable ties and conduit for cable management",
    ],
    icon: "Factory",
    keyProducts: ["M8/M12 connectors", "Wire ferrules", "Cable accessories", "CPC connectors"],
  },
];
