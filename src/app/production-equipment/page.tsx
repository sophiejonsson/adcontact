import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Production Equipment | Wire Processing Machines",
  description:
    "Wire cutting machines, stripping machines, crimping equipment, ultrasonic welding, quality assurance modules, and test systems for wire harness production.",
};

export default function ProductionEquipmentPage() {
  redirect("/webshop/production-equipment.html");
}
