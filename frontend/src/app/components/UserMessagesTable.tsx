"use client";
import React, { use, useState } from "react";
import ChatUsers from "./ChatUsers";
import { Search, MessageCircle } from "lucide-react";
const UserMessagesTable = ({ users }: { users: any[] }) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleChat = () => {
    return isOpen ? setIsOpen(false) : setIsOpen(true);
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="px-4 py-3 border-0 text-uppercase small fw-bold text-muted">
                Khách hàng
              </th>

              <th className="py-3 border-0 text-uppercase small fw-bold text-muted d-none d-md-table-cell">
                Tin nhắn cuối
              </th>
              <th className="px-4 py-3 border-0 text-uppercase small fw-bold text-muted text-end">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-bottom">
                <td className="px-4 py-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold me-3"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <div className="fw-bold mb-0 text-dark">
                        {user.senderType == "business" ? (user.receiver.username):(user.sender.username)}
                      </div>
                      <div className="small text-muted">
                        {user.senderType == "business" ? (user.receiver.email):(user.sender.email)}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3 d-none d-md-table-cell">
                  <small className="text-muted italic">{user.content}</small>
                </td>
                <td className="px-4 py-3 text-end">
                  <button
                    onClick={() => {
                      handleChat();
                      setSelectedUser(user.senderType == "business" ? user.receiver : user.sender);
                    }}
                    className="btn btn-outline-primary btn-sm rounded-3 px-3 border-light-subtle shadow-sm hover-primary"
                  >
                    <MessageCircle size={14} className="me-2" />
                    Nhắn tin
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && <ChatUsers user={selectedUser} open={isOpen} />}
    </>
  );
};

export default UserMessagesTable;
