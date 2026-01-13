"use client";
import React, { useEffect, useRef, useState } from "react";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

interface Notification {
  id: string;
  message: string;
  sender: {
    username: string;
    avatar: string;
    id: string;
  };
  type: string;
  receiver: {
    id: string;
  };
}

const DisplayNotification = () => {
  const [count, setCount] = useState(2);
  const notifications: Notification[] = [
    {
      id: "1",
      message: "Bạn có đơn hàng mới",
      sender: { username: "Admin", avatar: "/avatar1.png", id: "u1" },
      type: "order",
      receiver: { id: "me" },
    },
    {
      id: "2",
      message: "Sản phẩm bạn theo dõi đang giảm giá",
      sender: { username: "System", avatar: "/avatar2.png", id: "u2" },
      type: "discount",
      receiver: { id: "me" },
    },
  ];

  return (
    <>
      <style jsx>{`
        .dropdown-menu {
          min-width: 250px;
          border-radius: 12px;
          animation: fadeIn 0.3s ease-in-out;
        }
        .dropdown-item {
          border-radius: 8px;
          transition: background-color 0.2s ease-in-out;
        }
        .dropdown-item:hover {
          background-color: #f0f0f0;
        }
        .dropdown-toggle::after {
          display: none;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="dropdown">
        <a
          className="ms-3 me-3 nav-link dropdown-toggle position-relative"
          href="#"
          id="notificationDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <Image
            alt="notification"
            width={28}
            height={28}
            src={
              "data:image/png;base64,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"
            }
          />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {count}
            <span className="visually-hidden">unread notifications</span>
          </span>
        </a>

        <ul
          className="dropdown-menu dropdown-menu-end shadow-lg p-2"
          aria-labelledby="notificationDropdown"
        >
          {notifications && notifications.length > 0 ? (
            notifications.map((note) => (
              <li key={note.id}>
                <Link
                  className="dropdown-item d-flex align-items-center"
                  href="#"
                >
                  <Image
                    style={{
                      width: "30px",
                      height: "30px",
                      objectFit: "cover",
                    }}
                    className="img-fluid rounded-circle mb-4 border border-3 border-info shadow-sm me-2"
                    src={
                      note.sender.avatar
                        ? `https://www.lewesac.co.uk/wp-content/uploads/2017/12/default-avatar.jpg`
                        : "https://www.lewesac.co.uk/wp-content/uploads/2017/12/default-avatar.jpg"
                    }
                    width={30}
                    height={30}
                    alt={`${note.sender.username}`}
                  />
                  <div>
                    <div className="fw-bold">{note.sender.username}</div>
                    <div className="text-muted small">{note.message}</div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <p>Chưa Có Thông Báo Nào</p>
          )}
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item text-center text-muted small" href="#">
              Xem tất cả thông báo
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default DisplayNotification;
