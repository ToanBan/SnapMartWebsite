import SidebarBusiness from "../components/share/SidebarBusiness";
import RoleGuard from "../components/share/RoleGuard";
export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard role="business">
      <div className="d-flex">
        <SidebarBusiness />
        {children}
      </div>
    </RoleGuard>
  );
}
