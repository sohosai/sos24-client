"use client";

import { useEffect } from "react";
import { useTitleWithYear } from "@/common_components/hooks/yearUtils";

export const DynamicTitle = () => {
  const { title, isLoading } = useTitleWithYear();

  useEffect(() => {
    if (!isLoading && title) {
      document.title = title;
    }
  }, [title, isLoading]);

  return null;
};
