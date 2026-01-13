"use client";
import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

const Messages = () => {
  const [count, setCount] = useState(2);
  const [messagesCount, setMessagesCount] = useState(2);
  


  return (
    <>
      <a
        className="ms-3 me-2 nav-link position-relative"
        href="#"
        data-bs-toggle="offcanvas"
        data-bs-target="#messageOffcanvas"
      >
        <MessageCircle size={25} />
        {messagesCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {messagesCount}
          </span>
        )}
      </a>

      
      
    </>
  );
};

export default Messages;
