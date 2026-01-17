import React from "react";
import socket from "@/lib/socket";
const ReadNotification = (notificationId:string) => {
  console.log("note id", notificationId);
  try {
    socket.emit("readNotification", {
      id: notificationId,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default ReadNotification;
