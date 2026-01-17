import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import GetNotifications from "@/app/api/notifications/GetNotifications";



const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const handler = (data: any) => {
      setNotifications(prev => {
        if (prev.some(n => n.id === data.id)) return prev;
        return [data, ...prev];
      });
    };

    socket.on("receiveNotification", handler);

    const fetchNotifications = async () => {
      const data = await GetNotifications();
      setNotifications(data);
    };

    fetchNotifications();

    return () => {
      socket.off("receiveNotification", handler);
    };
  }, []);

  return notifications;
};

export default useNotifications;
