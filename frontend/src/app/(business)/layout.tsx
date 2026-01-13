import SidebarBusiness from "../components/share/SidebarBusiness";
export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="d-flex">
        <SidebarBusiness />
        {children}
      </div>
    </>
  );
}
