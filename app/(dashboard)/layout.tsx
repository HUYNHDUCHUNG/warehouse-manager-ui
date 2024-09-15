import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-full w-56 flex-col fixed z-50">
        <Sidebar />
      </div>
      <div className="h-[56px] bg-slate-500 w-[calc(100%-14rem)] ms-56">
        <Navbar />
      </div>
      <main className="h-full w-[calc(100%-14rem)] ms-56">{children}</main>
    </div>
  );
};
export default Dashboard;
