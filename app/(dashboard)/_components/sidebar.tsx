import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { LayoutDashboard, PackageSearch } from "lucide-react";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <div className="h-full bg-sky-700">
      <div className="p-6">
        <Logo />
      </div>
      <div>
        <Button className="px-6 py-6 flex items-center gap-x-2 bg-transparent w-full justify-start hover:bg-sky-600 rounded-none shadow-none">
          <div>
            <LayoutDashboard />
          </div>
          <span>Trang chủ</span>
        </Button>
        <Link href={"/product"}>
          <Button className="px-6 py-6 flex items-center gap-x-2 bg-transparent w-full justify-start hover:bg-sky-600 rounded-none shadow-none">
            <div>
              <PackageSearch />
            </div>
            <span>Quản lý thiết bị</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
