import { permanentRedirect } from "next/navigation";

// Cvilux now lives as a standard webshop catalogue hub (category 226) with the
// same dark hero + product browser as every other brand (Stocko, Deutsch, …),
// so its header stays consistent. This legacy /products/cvilux URL redirects to
// that canonical catalogue.
export default function CviluxRedirect() {
  permanentRedirect("/webshop/components/sealed-connectors/cvilux.html");
}
