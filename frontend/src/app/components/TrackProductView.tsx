"use client";

import { useEffect, useRef } from "react";
import { trackUserAction } from "./ActionUser";

const TrackProductView = ({ productId }: { productId: string }) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    trackUserAction({
      type: "view",
      productId,
    });

    hasTracked.current = true;
  }, [productId]);

  return null;
};

export default TrackProductView;
