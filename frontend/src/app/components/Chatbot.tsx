"use client";
import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Minus, Bot } from "lucide-react";
import ChatWithChatbot from "../api/users/ChatWithChatbot";
import AddCart from "../api/users/AddCart";
import AlertSuccess from "./share/AlertSuccess";
import AlertError from "./share/AlertError";
type Message = {
  id: number;
  sender: "user" | "bot";
  loading?: boolean;
  time?: string;
  payload?: any;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [success, setSucess] = useState(false);
  const [error, setError] = useState(false);
  const welcomeMessage: Message = {
    id: 0,
    sender: "bot",
    payload: {
      type: "TEXT",
      message:
        "Xin chào 👋 Tôi là trợ lý ảo. Tôi có thể giúp bạn tìm khóa học, tư vấn mua hàng hoặc hỗ trợ thanh toán.",
    },
    time: new Date().toLocaleTimeString(),
  };

  const toggleChat = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && messages.length === 0) {
        setMessages([welcomeMessage]);
      }
      return next;
    });
  };

  const handleChatWithChatbot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      payload: { type: "TEXT", message: inputValue },
      time: new Date().toLocaleTimeString(),
    };

    const loadingBotMessage: Message = {
      id: Date.now() + 1,
      sender: "bot",
      loading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingBotMessage]);
    setInputValue("");

    const response = await ChatWithChatbot(userMessage.payload.message);

    setMessages((prev) =>
      prev.map((msg) =>
        msg.loading
          ? {
              id: msg.id,
              sender: "bot",
              loading: false,
              payload: response?.reply || {
                type: "TEXT",
                message: "Xin lỗi, tôi chưa hiểu.",
              },
              time: new Date().toLocaleTimeString(),
            }
          : msg
      )
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleBuy = async (courseId: string, price: string) => {
    const results = await AddCart(courseId, price);
    if (results.success) {
      setSucess(true);
      setTimeout(() => {
        setSucess(false);
      }, 3000);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <>
      <div
        className="chatbot-container position-fixed bottom-0 end-0 m-4"
        style={{ zIndex: 1050 }}
      >
        <button
          onClick={toggleChat}
          className={`btn ${
            isOpen ? "btn-danger" : "btn-primary"
          } rounded-circle shadow-lg d-flex align-items-center justify-content-center`}
          style={{ width: "60px", height: "60px" }}
        >
          {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        </button>

        <div
          className="card shadow border-0 position-absolute bottom-100 end-0 mb-3"
          style={{
            width: "380px",
            height: "550px",
            borderRadius: "20px",
            display: isOpen ? "flex" : "none",
            flexDirection: "column",
          }}
        >
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <Bot size={20} />
              <strong>Trợ lý AI</strong>
            </div>
            <button onClick={toggleChat} className="btn btn-link text-white">
              <Minus size={18} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="card-body bg-light overflow-auto d-flex flex-column"
            style={{ gap: "14px" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-4 ${
                  msg.sender === "user"
                    ? "bg-primary text-white align-self-end"
                    : "bg-white border align-self-start"
                }`}
                style={{ maxWidth: "85%", fontSize: "14px" }}
              >
                {msg.loading && (
                  <div className="d-flex align-items-center gap-2">
                    <span className="spinner-border spinner-border-sm"></span>
                    Đang trả lời...
                  </div>
                )}

                {!msg.loading && msg.payload?.type === "TEXT" && (
                  <div>{msg.payload.message}</div>
                )}

                {!msg.loading && msg.payload?.type === "ADVICE" && (
                  <>
                    <div className="mb-2">{msg.payload.message}</div>

                    {msg.payload.courses.map((course: any) => (
                      <div key={course.id} className="border rounded p-2 mb-2">
                        <strong>{course.productName}</strong>
                        <div className="text-muted">
                          {course.price.toLocaleString("vi-VN")}đ
                        </div>

                        <div className="d-flex gap-2 mt-2">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() =>
                              (window.location.href = `/course/${course.id}`)
                            }
                          >
                            Xem chi tiết
                          </button>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleBuy(course.id, course.price)}
                          >
                            Mua ngay
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {!msg.loading && msg.payload?.type === "COURSE_LIST" && (
                  <>
                    <div className="mb-2">{msg.payload.message}</div>

                    {msg.payload.courses.map((course: any) => (
                      <div key={course.id} className="border rounded p-2 mb-2">
                        <strong>{course.productName}</strong>
                        <div className="text-muted">
                          {course.price.toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {!msg.loading && msg.time && (
                  <div
                    className="text-end opacity-50 mt-1"
                    style={{ fontSize: 10 }}
                  >
                    {msg.time}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="card-footer">
            <form
              onSubmit={handleChatWithChatbot}
              className="input-group rounded-pill border px-2"
            >
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="form-control border-0"
                placeholder="Nhập tin nhắn..."
              />
              <button className="btn btn-primary" disabled={!inputValue.trim()}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {success && (<AlertSuccess message="Added Item Successfully"/>)}
      {error && (<AlertError message="Add Item Failed"/>)}
    </>
  );
};

export default Chatbot;
