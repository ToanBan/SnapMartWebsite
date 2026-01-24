"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Send, Paperclip } from "lucide-react";
import socket from "../../lib/socket";
import UploadsFile from "../api/users/UploadsFile";
import SendNotification from "../api/users/SendNotification";
interface FriendsProps {
  following: {
    id: string;
    username: string;
    email: string;
    avatar: string;
  };
}

interface MessageProps {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  type: String;
}

const GetFriend = () => {
  const [friends, setFriends] = useState<FriendsProps[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<FriendsProps | null>(
    null
  );
  const [showChat, setShowChat] = useState(false);
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/`;
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");

  const fetchFriends = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setFriends(Array.isArray(data.message) ? data.message : []);
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setMessages(Array.isArray(data.message) ? data.message : []);
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const SendMessage = () => {
    const recieveId = selectedFriend?.following.id;
    if (!recieveId) return;
    if (content.trim() === "") return;

    const data = { recieveId, content, fileName };
    socket.emit("sendMessage", data);
    SendNotification(recieveId, "MESSAGE", "Có Tin Nhắn Mới");
    setContent("");
  };

  useEffect(() => {
    fetchFriends();
    fetchMessages();
  }, []);

  const openChat = (friend: FriendsProps) => {
    setSelectedFriend(friend);
    setShowChat(true);
  };

  useEffect(() => {
    socket.on("receiveMessage", (data: MessageProps) => {
      console.log("Tin nhắn mới nhận được:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  

  return (
    <>
      <div
        className="offcanvas offcanvas-end shadow"
        tabIndex={-1}
        id="messageOffcanvas"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold">Tin nhắn</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div className="offcanvas-body p-0">
          <ul className="list-group list-group-flush">
            {friends.length !== 0 ? (
              friends.map((friend) => (
                <li
                  key={friend.following.id}
                  className="list-group-item d-flex align-items-start"
                  style={{ cursor: "pointer" }}
                  onClick={() => openChat(friend)}
                >
                  <Image
                    src={
                      friend.following.avatar
                        ? `${imageUrl}${friend.following.avatar}`
                        : "https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png"
                    }
                    alt="avatar-profile"
                    width={40}
                    height={40}
                    className="rounded-circle me-3"
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <h6 className="mb-0 fw-semibold">
                        {friend.following.username}
                      </h6>
                    </div>
                    <p className="mb-0 text-muted small">Nhấn để chat 💬</p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center">Chưa Có Bạn Bè</p>
            )}
          </ul>
        </div>
      </div>

      {showChat && selectedFriend && (
        <div
          className="chat-box position-fixed bottom-0 end-0 me-3 mb-3 shadow-lg rounded-4"
          style={{
            width: "350px",
            zIndex: 2000,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <div
            className="d-flex align-items-center px-3 py-2"
            style={{
              background: "linear-gradient(135deg, #007bff, #00b4d8)",
              color: "white",
            }}
          >
            <Image
              src={
                selectedFriend.following.avatar
                  ? `${imageUrl}${selectedFriend.following.avatar}`
                  : "https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png"
              }
              alt="friend-avatar"
              width={40}
              height={40}
              className="rounded-circle me-2 border border-light"
            />
            <strong>{selectedFriend.following.username}</strong>
            <button
              className="btn-close btn-close-white ms-auto"
              onClick={() => setShowChat(false)}
            ></button>
          </div>

          <div
            className="p-3 bg-light"
            style={{ height: "260px", overflowY: "auto", fontSize: "0.9rem" }}
          >
            {messages.length === 0 ? (
              <p className="text-muted text-center mt-5">
                💬 Hãy bắt đầu cuộc trò chuyện...
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`d-flex mb-2 ${
                    msg.senderId === selectedFriend.following.id
                      ? "justify-content-start"
                      : "justify-content-end"
                  }`}
                >
                  <div
                    className="p-2 rounded"
                    style={{
                      maxWidth: "70%",
                      background:
                        msg.senderId === selectedFriend.following.id
                          ? "#f1f0f0"
                          : "#007bff",
                      color:
                        msg.senderId === selectedFriend.following.id
                          ? "#000"
                          : "#fff",
                    }}
                  >
                    {msg.type === "file" ? (
                      <a
                        href={`${imageUrl}api/download/${msg.content}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color:
                            msg.senderId === selectedFriend.following.id
                              ? "#000"
                              : "#fff",
                          textDecoration: "underline",
                          wordBreak: "break-all",
                        }}
                      >
                        📎 {msg.content}
                      </a>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-top bg-white d-flex align-items-center">
            <button
              className="btn btn-light rounded-circle me-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={18} />
            </button>
            <input
              name="fileName"
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const result = await UploadsFile(file);
                console.log(result);

                if (result?.success) {
                  socket.emit("sendMessage", {
                    recieveId: selectedFriend?.following.id,
                    content: result.fileName,
                    type: "file",
                  });
                }

                e.target.value = "";
              }}
            />

            <input
              type="text"
              className="form-control form-control-sm rounded-pill me-2"
              placeholder="Nhập tin nhắn..."
              style={{ fontSize: "0.9rem" }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  SendMessage();
                }
              }}
            />

            <button
              onClick={SendMessage}
              className="btn btn-primary rounded-circle px-3 py-2"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GetFriend;
