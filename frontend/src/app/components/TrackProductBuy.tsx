"use client"
import { useEffect, useRef } from "react";
import { trackUserAction } from "./ActionUser";

const TrackProductBuy = ({productsIds}:{productsIds:[]}) => {
  const hasTracked = useRef(false);
  useEffect(() => {
    if (hasTracked.current) return;

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    trackUserAction({
      type: "buy-products",
      productIds:productsIds
    });

    hasTracked.current = true;
  }, []);

  return null;
};

export default TrackProductBuy;
