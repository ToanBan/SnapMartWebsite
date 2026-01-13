"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Send, Paperclip, Smile, CheckCheck } from "lucide-react";
import socket from "@/lib/socket";
import GetMessagesBusiness from "../api/messages/GetMessagesBusiness";
interface MessageProps {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

const ChatUsers = ({ user, open }: { user: any; open: boolean }) => {
  const [isOpen, setIsOpen] = useState(open);
  const [message, setMessage] = useState("");
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    setUserId(userId);
  });

  useEffect(() => {
    setIsOpen(open);
  }, [open, user]);

  const fetchMessages = async () => {
    const data = await GetMessagesBusiness();
    setMessages((prev) => [...prev, ...data]);
    console.log(data);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    socket.on("receiveMessageBusiness", (data: MessageProps) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receiveMessageBusiness");
    };
  }, []);

  if (!isOpen || !user) return null;
  const sendMessageBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.id) return;
    const receiverId = user.id;
    if (content.trim() === "") return;
    const data = { receiverId, content };
    console.log(data);
    socket.emit("sendMessageBusiness", data);
    setContent("");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return createPortal(
    <div
      className="card shadow-lg border-0 overflow-hidden"
      style={{
        position: "fixed",
        right: "24px",
        bottom: "24px",
        width: "400px",
        height: "600px",
        borderRadius: "24px",
        zIndex: 9999,
        animation: "slideInUp 0.25s ease-out",
      }}
    >
      {/* HEADER */}
      <div className="card-header bg-primary py-3 border-0 d-flex align-items-center justify-content-between text-white">
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center fw-bold border border-white border-opacity-25"
            style={{ width: 45, height: 45 }}
          >
            {user.avatar || user.username.charAt(0)}
          </div>
          <div>
            <h6 className="mb-0 fw-bold">{user.username}</h6>
            <div
              className="d-flex align-items-center gap-1"
              style={{ fontSize: 11 }}
            >
              <span
                className="bg-success rounded-circle"
                style={{ width: 8, height: 8 }}
              />
              Đang trực tuyến
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="btn btn-link text-white p-2 border-0 opacity-75 hover-opacity-100"
        >
          <X size={18} />
        </button>
      </div>

      <div className="card-body bg-light overflow-auto p-4">
        <div className="chat-body">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.senderId == userId ? "msg-user" : "msg-bot"
                }`}
              >
                {message.content}
              </div>
            ))
          ) : (
            <></>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* FOOTER */}
      <div className="card-footer bg-white border-top p-3">
        <form onSubmit={sendMessageBusiness}>
          <div className="input-group bg-light rounded-pill p-1 border">
            <button className="btn btn-link text-muted border-0">
              <Paperclip size={20} />
            </button>

            <input
              type="text"
              className="form-control border-0 bg-transparent shadow-none"
              placeholder="Nhập tin nhắn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ fontSize: 14 }}
            />

            <button className="btn btn-link text-muted border-0">
              <Smile size={20} />
            </button>

            <button
              className={`btn rounded-circle d-flex align-items-center justify-content-center p-2 mx-1 ${
                message ? "btn-primary shadow" : "btn-light text-muted"
              }`}
              style={{ width: 38, height: 38 }}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .hover-opacity-100:hover { opacity: 1 !important; }
      
        .chat-body {
          flex: 1;
          padding: 18px;
          background: #f8fafc;
          overflow-y: auto;
        }

        .message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 12px;
        }

        .msg-bot {
          background: white;
          align-self: flex-start;
          border-bottom-left-radius: 6px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
        }

        .msg-user {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          color: white;
          align-self: flex-end;
          margin-left: auto;
          border-bottom-right-radius: 6px;
        }
      
      `}</style>
    </div>,
    document.body
  );
};

export default ChatUsers;
