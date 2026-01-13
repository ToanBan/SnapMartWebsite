"use client";

import { useEffect, useRef } from "react";
import { trackUserAction } from "./ActionUser";

const TrackProductSearch = ({ query }: { query: string }) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    trackUserAction({
      type: "search",
      query,
    });
  }, []);

  return null;
};

export default TrackProductSearch;
