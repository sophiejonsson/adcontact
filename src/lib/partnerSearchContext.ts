"use client";

import { createContext, useContext } from "react";

/** Provides the current product-browser search query to embedded partner
 *  content (e.g. StockoSeriesBrowser) so that typing in the main search bar
 *  also filters the series/machine grid inline. */
export const PartnerSearchContext = createContext<string>("");
export const usePartnerSearch = () => useContext(PartnerSearchContext);
