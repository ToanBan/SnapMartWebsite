import SidebarPage from "../components/share/Sidebar";
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
