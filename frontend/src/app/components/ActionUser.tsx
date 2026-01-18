"use client";

export type UserAction = {
  type: string;
  productId?: string;
  query?: string;
  productIds?: string[];
  timestamp: number;
};

const MAX_ACTIONS = 20;

export const trackUserAction = (action: Omit<UserAction, "timestamp">) => {
  if (typeof window === "undefined") return;

  const userIdRaw = localStorage.getItem("userId");
  if (!userIdRaw || userIdRaw === "null" || userIdRaw === "undefined") {
    return;
  }

  const userId = String(userIdRaw);
  const storageKey = `userActions_${userId}`;

  let actions: UserAction[] = [];
  try {
    const raw = localStorage.getItem(storageKey);
    actions = raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Parse userActions error:", err);
    actions = [];
  }

  actions.push({
    ...action,
    timestamp: Date.now(),
  });

  if (actions.length > MAX_ACTIONS) {
    actions.shift();
  }
  localStorage.setItem(storageKey, JSON.stringify(actions));
  console.log(`User ${userId} actions:`, actions);
};
