import React from "react";

const ChatWithChatbot = async (caption: string) => {
  try {
    const res = await fetch("http://localhost:5000/api/chatbot", {
      method: "POST",
      body: JSON.stringify({ caption }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default ChatWithChatbot;
