import SidebarPage from "../components/share/Sidebar";
import RoleGuard from "../components/share/RoleGuard";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard role="admin">
      <div className="d-flex">
        <SidebarPage />
        {children}
      </div>
    </RoleGuard>
  );
}
