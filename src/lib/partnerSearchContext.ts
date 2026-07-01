"use client";

import { createContext, useContext } from "react";

/** Provides the current product-browser search query to embedded partner
 *  content (e.g. StockoSeriesBrowser) so that typing in the main search bar
 *  also filters the series/machine grid inline. */
export const PartnerSearchContext = createContext<string>("");
export const usePartnerSearch = () => useContext(PartnerSearchContext);

/** Provides the currently-selected partner facet value (e.g. a Stocko pitch)
 *  to embedded partner content. The parent product browser renders the facet
 *  options in its own left sidebar — matching every other filter on the page —
 *  and pushes the selection down here, so the embedded browser only has to
 *  render the resulting grid. `null` means "all". */
export const PartnerFilterContext = createContext<string | null>(null);
export const usePartnerFilter = () => useContext(PartnerFilterContext);
