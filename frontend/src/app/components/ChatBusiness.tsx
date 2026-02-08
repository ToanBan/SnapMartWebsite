"use client";
import React, { useEffect, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import socket from "../../lib/socket";
import GetMessagesBusiness from "../api/messages/GetMessagesBusiness";
interface MessageProps {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

const ChatBusiness = ({ businessId }: { businessId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [userId, setUserId] = useState("");
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    setUserId(userId);
  });

  const fetchMessages = async () => {
    const data = await GetMessagesBusiness();
    if(!data) return;
    setMessages((prev) => [...prev, ...data]);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleChatbotBusiness = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessageBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;
    const receiverId = businessId;
    if (content.trim() === "") return;
    const data = { receiverId, content, type: "user" };
    console.log(data);
    socket.emit("sendMessageBusiness", data);
    setContent("");
  };

  useEffect(() => {
    socket.on("receiveMessageBusiness", (data: MessageProps) => {
      console.log("Tin nhắn mới nhận được:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receiveMessageBusiness");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div id="chat-widget">
        {isOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="d-flex align-items-center gap-2">
                <div className="bot-avatar">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                    alt="bot"
                  />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Chat With Store</h6>
                  <small className="status">● Online</small>
                </div>
              </div>
              <button
                className="btn-close-custom"
                onClick={handleChatbotBusiness}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="chat-body">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
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

            <div className="chat-footer">
              <form
                className="d-flex w-100 gap-2"
                onSubmit={sendMessageBusiness}
              >
                <input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ backgroundColor: "white", color: "black" }}
                  type="text"
                  placeholder="Nhập tin nhắn..."
                />
                <button className="send-btn">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        )}

        <button onClick={handleChatbotBusiness} className="chat-button">
          <MessageCircle size={26} />
        </button>
      </div>

      <style>{`
        #chat-widget {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
        }

        /* Floating button */
        .chat-button {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border: none;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.45);
          transition: all 0.3s ease;
        }

        .chat-button:hover {
          transform: scale(1.1);
        }

        /* Chat window */
        .chat-window {
          position: absolute;
          bottom: 90px;
          right: 0;
          width: 360px;
          height: 480px;
          background: #ffffff;
          border-radius: 22px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: fadeUp 0.25s ease;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Header */
        .chat-header {
          padding: 16px 18px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .bot-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: white;
          padding: 4px;
        }

        .bot-avatar img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .status {
          font-size: 12px;
          color: #bbf7d0;
        }

        .btn-close-custom {
          background: rgba(255,255,255,0.15);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-close-custom:hover {
          background: rgba(255,255,255,0.25);
        }

        /* Body */
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

        /* Footer */
        .chat-footer {
          padding: 14px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 10px;
          background: white;
        }

        .chat-footer input {
          flex: 1;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 10px 14px;
          font-size: 14px;
          outline: none;
        }

        .chat-footer input:focus {
          border-color: #2563eb;
        }

        .send-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .send-btn:hover {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
};

export default ChatBusiness;
