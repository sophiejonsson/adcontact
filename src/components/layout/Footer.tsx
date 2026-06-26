import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";

const footerLinks = {
  "Industrial Components": [
    { label: "Connectors", href: "/webshop/components/sealed-connectors.html" },
    { label: "Heat Shrink Tubing", href: "/webshop/components/heat-shrinkable.html" },
    { label: "Contacts & Terminals", href: "/webshop/components/contacts.html" },
    { label: "Accessories", href: "/webshop/components/accessories.html" },
    { label: "Tools", href: "/webshop/components/tools.html" },
    { label: "Wire Ferrules", href: "/webshop/components/sealed-connectors/zoller-frohlich/wire-ferrules.html" },
  ],
  "Production Equipment": [
    { label: "Cutting Machines", href: "/webshop/production-equipment/cutting-machines-for-a-variety-of-materials.html" },
    { label: "Stripping Machines", href: "/webshop/production-equipment/stripping-machines.html" },
    { label: "Crimping Equipment", href: "/webshop/production-equipment/crimping-equipment.html" },
    { label: "Misc. Equipment", href: "/webshop/production-equipment/misc-equipment.html" },
    { label: "Ultrasonic Welding", href: "/webshop/production-equipment/ultrasonic-welding.html" },
  ],
  Brands: [
    { label: "Deutsch", href: "/webshop/components/sealed-connectors/deutsch.html" },
    { label: "TE Connectivity", href: "/webshop/components/sealed-connectors/te-connectivity.html" },
    { label: "Stocko", href: "/brands/stocko" },
    { label: "DSG-Canusa", href: "/brands/dsg-canusa" },
    { label: "Mecal", href: "/brands/mecal" },
    { label: "Zoller & Fröhlich", href: "/brands/zoller-frohlich" },
    { label: "View all brands →", href: "/brands" },
  ],
  Company: [
    { label: "About Adcontact", href: "/about" },
    { label: "Quality & ISO", href: "/about#quality" },
    { label: "Contact & Offices", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] text-white">
      {/* CTA strip */}
      <div className="border-b border-[#1a2f5a]">
        <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">Ready to source your components?</h3>
            <p className="text-[#94a3b8] text-sm">
              Request a quote or speak with a technical sales specialist across the Nordics.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              href="/contact/quote"
              className="btn-elevate btn-elevate-amber flex items-center gap-2 px-5 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#0a1628] text-sm font-semibold rounded-lg"
            >
              Request a quote
              <ArrowRight size={14} />
            </Link>
            <a
              href="tel:+46084453600"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a2f5a] hover:bg-[#1e3a6e] text-white text-sm font-medium rounded-md transition-colors"
            >
              <Phone size={14} />
              Call us
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1440px] mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 lg:-mt-3">
            <div className="mb-4">
              <Image
                src="/images/bottomlogotransparant.png"
                alt="Gammeter Adcontact"
                width={190}
                height={102}
                className="h-auto w-[190px] object-contain object-left"
                unoptimized
              />
            </div>
            <p className="text-[#64748b] text-xs leading-relaxed mb-4">
              Specialist industrial component and wire-processing partner for Nordic manufacturers.
            </p>
            <div className="space-y-2 text-xs text-[#64748b]">
              <div className="flex items-start gap-2">
                <MapPin size={12} className="mt-0.5 text-[#2563eb] flex-shrink-0" />
                <span>Ekbacksvägen 22<br />SE-168 69 Bromma, Sweden</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-[#2563eb]" />
                <a href="tel:+46084453600" className="hover:text-white transition-colors">+46 (0)8-445 36 00</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-[#2563eb]" />
                <a href="mailto:info@adcontact.se" className="hover:text-white transition-colors">info@adcontact.se</a>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <a
                href="https://www.linkedin.com/company/adcontact-gammeter/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#1a2f5a] hover:bg-[#2563eb] rounded-md flex items-center justify-center transition-colors text-xs font-bold text-[#60a5fa]"
                aria-label="LinkedIn"
              >
                in
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold text-[#e2e8f0] uppercase tracking-widest mb-4">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-[#64748b] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#0f2042]">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[#334155] text-xs">
            © {new Date().getFullYear()} Adcontact AB / Gammeter AB. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#334155]">
            <span>ISO 9001:2015 Certified</span>
            <span>·</span>
            <Link href="/about#quality" className="hover:text-[#64748b] transition-colors">Quality Policy</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-[#64748b] transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
