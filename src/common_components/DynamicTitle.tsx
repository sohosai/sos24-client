"use client";

import { useEffect } from "react";
import { getTitleWithYear } from "@/lib/yearUtils";

/**
 * Client component to update document title dynamically based on year
 */
export const DynamicTitle = () => {
  useEffect(() => {
    document.title = getTitleWithYear();
  }, []);

  return null;
};