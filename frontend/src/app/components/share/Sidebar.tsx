"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  BarChart3,
  CheckSquare,
  Users,
  Settings,
  ChevronLeft,
  Menu,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

interface NavItemData {
  to?: string;
  name: string;
  icon: React.ElementType;
  children?: { name: string; to: string }[];
}

interface NavItemProps {
  to: string;
  item: NavItemData;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const navItems: NavItemData[] = [
  { name: "DASHBOARD", icon: LayoutDashboard, to: "/" },
  {
    name: "Users",
    icon: Users,
    children: [
      { name: "Verify Business", to: "users/verifybusiness" },
      { name: "Change Role", to: "users/role" },
      { name: "Posts", to: "users/posts" },
      { name: "Users", to: "users/users" },
    ],
  },
  {
    name: "Owner'Business",
    icon: BarChart3,
    children: [
      { name: "List Business", to: "business" },
      { name: "Verify Product", to: "business/verifyproduct" },
      { name: "Orders", to: "business/orders" },
    ],
  },
  { name: "Error", icon: AlertTriangle, to: "errors" },
];

const NavItem: React.FC<NavItemProps> = ({
  item,
  isCollapsed,
  to,
  isActive,
  onClick,
}) => {
  const Icon = item.icon;
  const activeClass = isActive ? "active" : "";

  return (
    <Link className="text-decoration-none" href={`/admin/${to.toLowerCase()}`}>
      <div
        className={`nav-link d-flex align-items-center mb-2 ${activeClass} ${
          isCollapsed ? "justify-content-center" : ""
        }`}
        onClick={onClick}
      >
        <Icon
          className={`me-3 ${isCollapsed ? "m-0" : ""}`}
          style={{ width: "24px", height: "24px" }}
        />
        <span className={`nav-item-text ${isCollapsed ? "collapsed" : ""}`}>
          {item.name}
        </span>
      </div>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const [activeItem, setActiveItem] = useState<string>("Bảng Điều Khiển");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed]);

  const collapseIcon = isCollapsed ? Menu : ChevronLeft;

  return (
    <div
      className={`sidebar position-fixed top-0 start-0 vh-100 shadow-lg z-3 ${
        isCollapsed ? "collapsed" : ""
      }`}
    >
      <div
        className={`d-flex align-items-center p-4 h-16 border-bottom border-dark ${
          isCollapsed ? "justify-content-center" : "justify-content-between"
        }`}
      >
        <h1
          className={`h5 fw-bold text-white transition-opacity logo-text mb-0 ${
            isCollapsed ? "collapsed" : ""
          }`}
        >
          ADMIN PANEL
        </h1>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="btn btn-dark p-1 rounded-circle text-secondary transition-colors d-md-block d-none"
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          {React.createElement(collapseIcon, { className: "w-6 h-6" })}
        </button>
      </div>

      <nav className="p-3 mt-2 d-flex flex-column flex-grow-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <div key={item.name}>
            <NavItem
              item={item}
              to={item.to || ""}
              isCollapsed={isCollapsed}
              isActive={activeItem === item.name}
              onClick={() => {
                if (item.children) {
                  setOpenSubmenu(openSubmenu === item.name ? null : item.name);
                } else {
                  setActiveItem(item.name);
                }
              }}
            />

            {item.children && openSubmenu === item.name && !isCollapsed && (
              <div className="ms-4">
                {item.children.map((child) => (
                  <Link
                    key={child.name}
                    href={`/admin/${child.to}`}
                    className="d-block text-secondary py-1 ps-4 small submenu-link text-decoration-none"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer p-3 border-top border-dark">
        <div
          className={`d-flex align-items-center ${
            isCollapsed ? "justify-content-center" : ""
          }`}
        >
          <img
            className="rounded-circle object-fit-cover bg-primary"
            style={{ width: "40px", height: "40px" }}
            src="https://placehold.co/100x100/1D4ED8/ffffff?text=U"
            alt="Ảnh đại diện"
          />
          <div className={`ms-3 logo-text ${isCollapsed ? "collapsed" : ""}`}>
            <p className="small fw-medium text-white mb-0">Người Dùng</p>
            <p
              className="small text-muted mb-0 text-truncate"
              style={{ maxWidth: "120px" }}
            >
              user@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarPage: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className="admin-layout d-flex bg-light min-vh-100">
      <style>{`
        :root {
          --sidebar-width-expanded: 250px;
          --sidebar-width-collapsed: 80px;
        }
        body { font-family: 'Inter', sans-serif; margin: 0; }
        
        .sidebar {
          width: var(--sidebar-width-expanded);
          transition: width 0.3s ease-in-out;
          background-color: #0b0f15 !important;
          display: flex;
          flex-direction: column;
        }
        .sidebar.collapsed { width: var(--sidebar-width-collapsed); }
        
        .nav-item-text, .logo-text {
          overflow: hidden;
          white-space: nowrap;
          transition: opacity 0.3s ease-in-out, width 0.3s ease-in-out;
        }
        .collapsed .nav-item-text, .logo-text.collapsed {
          opacity: 0;
          width: 0;
        }

        .sidebar .nav-link {
          color: #adb5bd;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          transition: all 0.2s;
        }
        .sidebar .nav-link:hover { background-color: #212529; color: #fff; }
        .sidebar .nav-link.active {
          background-color: rgba(0, 123, 255, 0.2);
          color: #4da6ff;
          border-left: 4px solid #0d6efd;
          padding-left: calc(1rem - 4px);
        }

        /* FIX: Main Content Area */
        .main-wrapper {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          min-width: 0; /* Ngăn chặn vỡ layout flex */
          transition: margin-left 0.3s ease-in-out;
        }

        @media (min-width: 768px) {
          .main-wrapper {
            margin-left: ${
              isCollapsed
                ? "var(--sidebar-width-collapsed)"
                : "var(--sidebar-width-expanded)"
            };
          }
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>

      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="main-wrapper">
        {/* Header Mobile */}
        <div
          className="d-md-none sticky-top bg-white shadow-sm p-3 d-flex justify-content-between align-items-center"
          style={{ zIndex: 1040 }}
        >
          <h2 className="fs-5 fw-semibold text-dark mb-0">GEMINI APP</h2>
          <button
            onClick={() => setIsCollapsed(false)}
            className="btn btn-outline-secondary p-2 rounded-circle"
          >
            <Menu style={{ width: "24px", height: "24px" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarPage;
