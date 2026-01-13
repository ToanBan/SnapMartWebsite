import React from "react";
import { Search, User } from "lucide-react";
import GetUsesMessages from "@/app/api/business/GetUsesMessages";
import UserMessagesTable from "@/app/components/UserMessagesTable";
const MessagePage = async () => {
  const users = await GetUsesMessages();

  return (
    <>
      <div className="container-xl py-5">
        <div className="bg-light">
          <div className="container">
            <div className="mb-4">
              <h2 className="fw-bold text-dark">Quản lý Hội thoại</h2>
              <p className="text-muted">
                Chọn một người dùng để bắt đầu hỗ trợ trực tuyến
              </p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white py-3 border-bottom-0 d-flex justify-content-between align-items-center">
                <div
                  className="input-group input-group-sm"
                  style={{ maxWidth: "300px" }}
                >
                  <span className="input-group-text bg-light border-0">
                    <Search size={16} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-0"
                    placeholder="Tìm kiếm khách hàng..."
                  />
                </div>
              </div>

              <UserMessagesTable users={users} />
            </div>
          </div>

          <style>{`
        .hover-primary:hover {
          background-color: #0d6efd !important;
          color: white !important;
          border-color: #0d6efd !important;
        }
        .rounded-4 { border-radius: 1rem !important; }
      `}</style>
        </div>
      </div>
    </>
  );
};

export default MessagePage;
