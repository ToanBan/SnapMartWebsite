import NavigationMain from "@/app/components/share/NavigationMain";
import LoginPartial from "../components/share/LoginPartial";
export default async function MainLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <>
      <NavigationMain loginPartial={<LoginPartial/>}/>
      {children}
    </>
  );
}