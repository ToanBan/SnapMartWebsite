import SidebarPage from "../components/share/Sidebar";
import NavigationMain from "../components/share/NavigationMain";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="d-flex">
        
        <SidebarPage />
        {children}
      </div>
    </>
  );
}
