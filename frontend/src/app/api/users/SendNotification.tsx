import socket from "@/lib/socket";

const SendNotification = (
  receiverId: string,
  type: string,
  content: string
) => {
  
  const data = {
    receiver_id: receiverId,
    type,
    title: "THÔNG BÁO MỚI",
    content,
    is_read: false,
  };

  socket.emit("notification", data);

  console.log(data);
};

export default SendNotification;
