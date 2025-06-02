import { redirect } from "next/navigation";
import { Navbar } from "./_components/navbar";
import Sidebar from "./_components/sidebar";
import { auth } from "@/auth";

const DashboardLayout = async ({ children }: any) => {
   const session = await auth();
      
        if (!session?.user) {
          console.log(session?.user);
          redirect('/');
        }
          const role = session.user.role;
          if (role !== 'admin') {
            redirect('/');
          }
       
  return (
    <div className="h-full">
      <div className="h-[80px] lg:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden lg:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="lg:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
};
export default DashboardLayout;
