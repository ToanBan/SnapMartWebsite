"use client";

import { useEffect, useRef } from "react";
import SendAction from "../api/users/SendAction";

const TrackSendActionView = () => {
  const sentRef = useRef(false);
  
  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const raw = localStorage.getItem("userActions");
    if (!raw) return;

    const allActions = JSON.parse(raw);
    const actions = allActions[userId];

    if (!Array.isArray(actions) || actions.length === 0) return;

    SendAction({ actions });
  }, []);

  return null;
};

export default TrackSendActionView;
