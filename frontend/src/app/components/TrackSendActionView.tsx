"use client";

import { useEffect, useRef } from "react";
import SendAction from "../api/users/SendAction";

const TrackSendActionView = () => {
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;
    if (typeof window === "undefined") return;
    const userIdRaw = localStorage.getItem("userId");
    if (!userIdRaw || userIdRaw === "null" || userIdRaw === "undefined") {
      return;
    }
    const userId = String(userIdRaw);
    const storageKey = `userActions_${userId}`;
    let actions: any[] = [];
    try {
      const raw = localStorage.getItem(storageKey);
      actions = raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Parse userActions error:", err);
      return;
    }

    if (!Array.isArray(actions) || actions.length === 0) return;

    console.log("📤 Send actions for user:", userId, actions);
    SendAction({ actions });
    localStorage.removeItem(storageKey);
  }, []);

  return null;
};

export default TrackSendActionView;
