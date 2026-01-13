import NavigationMain from "@/app/components/share/NavigationMain";
import LoginPartialServer from "../components/share/LoginPartialServer";
import LoginPartial from "../components/share/LoginPartial";
export default async function MainLayout({ children }: { children: React.ReactNode }) {
  // const account = await LoginPartialServer();
  return (
    <>
      <NavigationMain loginPartial={<LoginPartial/>}/>
      {children}
    </>
  );
}