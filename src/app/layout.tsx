import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Adcontact, Industrial Components & Wire-Processing Solutions",
    template: "%s | Adcontact",
  },
  description:
    "Nordic specialist distributor of industrial electromechanical components, connectors, heat shrink tubing, crimp contacts, and wire-processing production equipment. TE Connectivity, Deutsch, Stocko, DSG-Canusa.",
  keywords: [
    "industrial components supplier",
    "electromechanical components",
    "heat shrink tubing",
    "Deutsch connectors",
    "TE Connectivity distributor",
    "wire processing equipment",
    "crimp contacts",
    "M8 M12 connectors",
    "wire ferrules",
    "connector supplier Sweden",
    "Nordic industrial components",
  ],
  openGraph: {
    type: "website",
    locale: "en_SE",
    url: "https://www.adcontact.se",
    siteName: "Adcontact",
    title: "Adcontact | Industrial Components & Wire-Processing Solutions",
    description:
      "Specialist industrial component and wire-processing partner for Nordic manufacturers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased"
        style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
