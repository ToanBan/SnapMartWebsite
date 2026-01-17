"use client";
import React, { useEffect } from "react";
import DisplayNotification from "./Notification";

const Header = () => {
  useEffect(() => {
    //@ts-ignore
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top header-glass rounded-navbar">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div className="brand-icon">SM</div>
            <span className="brand-text">SnapMART</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <DisplayNotification />
          </div>
        </div>
      </nav>

      <style>{`
        /* ===== HEADER GLASS ===== */
        .header-glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          padding: 0.75rem 0;
          box-shadow: 0 8px 30px rgba(0,0,0,0.04);
        }

        /* ===== BRAND ===== */
        .brand-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          box-shadow: 0 4px 14px rgba(79,70,229,0.4);
        }

        .brand-text {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1f2937;
        }

        /* ===== NOTIFICATION ===== */
        .notification-wrapper {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(79,70,229,0.08);
          color: #4f46e5;
          transition: all 0.25s ease;
        }

        .notification-wrapper:hover {
          background: rgba(79,70,229,0.15);
          transform: translateY(-1px);
        }

        .notification-wrapper i {
          font-size: 1.25rem;
        }

        .notification-dot {
          position: absolute;
          top: 9px;
          right: 9px;
          width: 9px;
          height: 9px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
        }

        /* ===== AVATAR ===== */
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          object-fit: cover;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .user-avatar:hover {
          border-color: #4f46e5;
          transform: translateY(-1px);
        }

        .rounded-navbar {
  border-radius: 10px;
}

      `}</style>
    </>
  );
};

export default Header;
