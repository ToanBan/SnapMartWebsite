"use client";

export type UserAction = {
  type: string;
  productId?: string;
  query?: string;
  productIds?:[]
  timestamp: number;
};

export const trackUserAction = (action: Omit<UserAction, "timestamp">) => {
  if (typeof window === "undefined") return;

  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const raw = localStorage.getItem("userActions");
  const data: Record<string, UserAction[]> = raw ? JSON.parse(raw) : {};

  if (!Array.isArray(data[userId])) {
    data[userId] = [];
  }

  data[userId].push({
    ...action,
    timestamp: Date.now(),
  });

  if (data[userId].length > 20) {
    data[userId].shift();
  }

  localStorage.setItem("userActions", JSON.stringify(data));
  console.log("all action", raw)
  console.log("User actions id:", data[userId]);
};
