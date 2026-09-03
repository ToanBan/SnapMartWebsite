import { io } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const socket = io(socketUrl, {
    transports: ["polling", "websocket"],
    withCredentials: true,
    autoConnect: true,
});

export default socket;