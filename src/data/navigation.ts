export type NavItem = {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
};

export type NavGroup = {
  label: string;
  href?: string;
  items: NavItem[];
};

export type MegaMenuSection = {
  id: string;
  label: string;
  href: string;
  groups: NavGroup[];
  variant?: "catalogue-tree";
};

const industrialComponentsGroup: NavGroup = {
  label: "Industrial Components",
  href: "/webshop/components.html",
  items: [
    {
      label: "Heat Shrink Tubing",
      href: "/webshop/components/heat-shrinkable.html",
      children: [
        { label: "HongShang", href: "/webshop/components/heat-shrinkable/hongshang.html" },
      ],
    },
    {
      label: "Connectors",
      href: "/webshop/components/sealed-connectors.html",
      children: [
        { label: "Stocko", href: "/webshop/components/sealed-connectors/stocko.html" },
        { label: "Deutsch Connectors", href: "/webshop/components/sealed-connectors/deutsch.html" },
        { label: "TE Connectivity", href: "/webshop/components/sealed-connectors/te-connectivity.html" },
        { label: "Cvilux", href: "/webshop/components/sealed-connectors/cvilux.html" },
        { label: "Vogt", href: "/webshop/components/sealed-connectors/vogt.html" },
        { label: "HTP", href: "/webshop/components/sealed-connectors/htp.html" },
        { label: "Zoller & Fröhlich", href: "/webshop/components/sealed-connectors/zoller-frohlich.html" },
      ],
    },
    {
      label: "Contacts",
      href: "/webshop/components/contacts.html",
      children: [
        { label: "Deutsch", href: "/webshop/components/contacts/deutsch.html" },
      ],
    },
    {
      label: "Accessories",
      href: "/webshop/components/accessories.html",
      children: [
        { label: "Deutsch", href: "/webshop/components/accessories/deutsch.html" },
      ],
    },
    {
      label: "Tools",
      href: "/webshop/components/tools.html",
      children: [
        { label: "Deutsch", href: "/webshop/components/tools/deutsch.html" },
      ],
    },
  ],
};

const productionEquipmentGroup: NavGroup = {
  label: "Production Equipment",
  href: "/webshop/production-equipment.html",
  items: [
    {
      label: "Cutting Machines",
      href: "/webshop/production-equipment/cutting-machines-for-a-variety-of-materials.html",
      children: [
        { label: "Ulmer", href: "/webshop/production-equipment/cutting-machines-for-a-variety-of-materials/ulmer.html" },
        { label: "Tekuwa", href: "/webshop/production-equipment/cutting-machines-for-a-variety-of-materials/tekuwa.html" },
        { label: "Junquan", href: "/webshop/production-equipment/cutting-machines-for-a-variety-of-materials/junquan.html" },
      ],
    },
    {
      label: "Stripping Machines",
      href: "/webshop/production-equipment/stripping-machines.html",
      children: [
        { label: "Zoller & Fröhlich", href: "/webshop/production-equipment/stripping-machines/zoller-frohlich.html" },
        { label: "Feintechnik Rittmyer", href: "/webshop/production-equipment/stripping-machines/feintechnik-rittmyer.html" },
      ],
    },
    {
      label: "Crimping equipment",
      href: "/webshop/production-equipment/crimping-equipment.html",
      children: [
        { label: "Mecal", href: "/webshop/production-equipment/crimping-equipment/mecal.html" },
        { label: "Zoller & Fröhlich", href: "/webshop/production-equipment/crimping-equipment/zoller-frohlich.html" },
        { label: "Stocko", href: "/webshop/production-equipment/crimping-equipment/stocko.html" },
      ],
    },
    {
      label: "Misc. Equipment",
      href: "/webshop/production-equipment/misc-equipment.html",
      children: [
        { label: "DSG Canusa", href: "/webshop/production-equipment/misc-equipment/dsg-canusa.html" },
      ],
    },
    {
      label: "Ultrasonic Welding",
      href: "/webshop/production-equipment/ultrasonic-welding.html",
      children: [
        { label: "Branson", href: "/webshop/production-equipment/ultrasonic-welding/branson.html" },
      ],
    },
  ],
};

export const megaMenuSections: MegaMenuSection[] = [
  {
    id: "products",
    label: "Webshop",
    href: "/webshop.html",
    groups: [
      industrialComponentsGroup,
      productionEquipmentGroup,
    ],
    variant: "catalogue-tree",
  },
];

export const topNavItems: NavItem[] = [
  { label: "Trusted Partners", href: "/brands" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
