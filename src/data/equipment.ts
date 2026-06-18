export type EquipmentItem = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  brand: string;
  brandSlug: string;
  shortDescription: string;
  keyFeatures: string[];
  icon: string;
};

export const equipmentCategories = [
  {
    id: "cutting",
    name: "Cutting Machines",
    slug: "cutting-machines",
    description: "Precision wire and cable cutting machines for manual, semi-automatic, and fully automatic production. Programmable cut lengths, high-speed throughput.",
    icon: "Scissors",
    image: "/images/sc11_completo_web12.jpg",
    brands: ["Mecal", "Zoller & Fröhlich", "Junquan"],
    keyFeatures: ["Programmable cut length", "High-speed throughput", "Wire range 0.1–50mm²", "Multi-wire bundles"],
  },
  {
    id: "stripping",
    name: "Stripping Machines",
    slug: "stripping-machines",
    description: "Automatic and semi-automatic wire stripping machines. Rotary blade and laser stripping options for precision stripping without conductor damage.",
    icon: "Zap",
    image: "/images/evf00_web2.jpg",
    brands: ["Zoller & Fröhlich", "Mecal", "Feintechnik Rittmyer"],
    keyFeatures: ["Rotary blade or laser", "Adjustable strip depth", "No nick guarantee", "Combined cut & strip"],
  },
  {
    id: "crimping",
    name: "Crimping Equipment",
    slug: "crimping-equipment",
    description: "Bench-mounted and inline crimp applicators, crimp presses, and crimp force monitoring systems for consistent, reliable wire termination.",
    icon: "Wrench",
    image: "/images/p120_web12.jpg",
    brands: ["Mecal", "Zoller & Fröhlich", "Stocko"],
    keyFeatures: ["Crimp force monitoring", "Quick-change applicator", "Height adjustment", "Process documentation"],
  },
  {
    id: "ultrasonic",
    name: "Ultrasonic Welding",
    slug: "ultrasonic-welding",
    description: "Ultrasonic welding systems for wire splicing, plastic welding, and wire-to-terminal bonding. Eliminates flux, heat, and consumables.",
    icon: "Waves",
    image: "/images/ultrasplice40_-_1.jpg",
    brands: ["Branson", "Mecal"],
    keyFeatures: ["Flux-free wire splice", "Consistent weld energy", "Force and power monitoring", "Weld documentation"],
  },
  {
    id: "quality",
    name: "Quality Assurance Modules",
    slug: "quality-assurance",
    description: "Vision systems, crimp force monitoring, seal-presence detection, and in-line measurement systems for process quality assurance.",
    icon: "ScanLine",
    image: "/images/mrsp_web.jpg",
    brands: ["Mecal", "Zoller & Fröhlich"],
    keyFeatures: ["Camera-based inspection", "Crimp force monitoring", "Seal presence detection", "SPC-ready data output"],
  },
  {
    id: "test",
    name: "Test Systems",
    slug: "test-systems",
    description: "Electrical continuity and isolation test systems for wire harness verification. 100% harness testing before assembly.",
    icon: "CheckSquare",
    image: "/images/mse_1.jpg",
    brands: ["Mecal"],
    keyFeatures: ["100% continuity test", "Isolation resistance test", "Multi-connector fixturing", "Pass/fail logging"],
  },
];
