"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Settings,
  ChevronLeft,
  Menu,
  MessageCircle,
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
  { name: "DASHBOARD", icon: LayoutDashboard, to: "" },
  {
    name: "Products",
    icon: FolderOpen,
    children: [
      { name: "List Product", to: "products" },
      { name: "Verify Orders", to: "orders" },
      { name: "Product is not bought", to: "nonproduct" },
    ],
  },
  { name: "Messages", icon: MessageCircle, to: "messages" },
  { name: "Người Dùng", icon: Users, to: "users" },
  { name: "Cài Đặt", icon: Settings, to: "settings" },
];

const NavItem: React.FC<NavItemProps> = ({
  item,
  isCollapsed,
  to,
  isActive,
  onClick,
}) => {
  const Icon = item.icon;

  return (
    <Link className="text-decoration-none" href={`/business/${to}`}>
      <div
        className={`nav-link d-flex align-items-center mb-2 ${
          isActive ? "active" : ""
        } ${isCollapsed ? "justify-content-center" : ""}`}
        onClick={onClick}
      >
        <Icon
          className={`me-3 ${isCollapsed ? "m-0" : ""}`}
          style={{ width: 24, height: 24 }}
        />
        <span className={`nav-item-text ${isCollapsed ? "collapsed" : ""}`}>
          {item.name}
        </span>
      </div>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed]);

  const CollapseIcon = isCollapsed ? Menu : ChevronLeft;

  return (
    <aside
      className={`sidebar position-fixed top-0 start-0 h-100 shadow-lg z-3 ${
        isCollapsed ? "collapsed" : ""
      }`}
    >
      {/* Header */}
      <div
        className={`d-flex align-items-center p-4 border-bottom border-dark ${
          isCollapsed ? "justify-content-center" : "justify-content-between"
        }`}
      >
        <h1
          className={`h5 fw-bold text-white logo-text ${
            isCollapsed ? "collapsed" : ""
          }`}
        >
          BUSINESS
        </h1>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="btn btn-dark p-1 rounded-circle d-none d-md-block"
        >
          <CollapseIcon />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
        {navItems.map((item) => (
          <div key={item.name}>
            <NavItem
              item={item}
              to={item.to || ""}
              isCollapsed={isCollapsed}
              isActive={false}
              onClick={() =>
                item.children
                  ? setOpenSubmenu(
                      openSubmenu === item.name ? null : item.name
                    )
                  : null
              }
            />

            {item.children && openSubmenu === item.name && !isCollapsed && (
              <div className="ms-4">
                {item.children.map((child) => (
                  <Link
                    key={child.name}
                    href={`/business/${child.to}`}
                    className="d-block text-secondary py-1 ps-4 small"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer position-absolute bottom-0 start-0 w-100 p-3">
        <div
          className={`d-flex align-items-center ${
            isCollapsed ? "justify-content-center" : ""
          }`}
        >
          <img
            className="rounded-circle"
            width={40}
            height={40}
            src="https://placehold.co/100x100/1D4ED8/ffffff?text=U"
            alt="User"
          />
          <div
            className={`ms-3 logo-text ${isCollapsed ? "collapsed" : ""}`}
          >
            <p className="text-white mb-0 small">Người Dùng</p>
            <p className="text-muted mb-0 small">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarBusiness: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <style>{`
        :root {
          --sidebar-expanded: 250px;
          --sidebar-collapsed: 80px;
        }

        .sidebar {
          width: var(--sidebar-expanded);
          background: #0b0f15;
          transition: width .3s;
        }
        .sidebar.collapsed {
          width: var(--sidebar-collapsed);
        }

        .nav-item-text,
        .logo-text {
          transition: opacity .3s, width .3s;
          white-space: nowrap;
        }
        .collapsed .nav-item-text,
        .collapsed .logo-text {
          opacity: 0;
          width: 0;
        }

        .nav-link {
          color: #adb5bd;
          border-radius: .5rem;
          padding: .75rem 1rem;
        }
        .nav-link:hover {
          background: #212529;
          color: #fff;
        }

        .sidebar-footer {
          border-top: 1px solid #212529;
        }
      `}</style>

      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* MAIN CONTENT */}
      <main
        style={{
          marginLeft: isCollapsed ? 80 : 250,
          height: "100vh",
          overflowY: "auto",
          transition: "margin-left .3s",
        }}
      >
        {/* Mobile Header */}
        <div className="d-md-none sticky-top bg-white shadow-sm p-3 d-flex justify-content-between">
          <h6 className="mb-0">GEMINI APP</h6>
          <button
            onClick={() => setIsCollapsed(false)}
            className="btn btn-outline-secondary btn-sm"
          >
            <Menu />
          </button>
        </div>

        <div className="p-4">{children}</div>
      </main>
    </div>
  );
};

export default SidebarBusiness;
