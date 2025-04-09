"use client";

import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../Logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { primaryMenuPaths } from "@/utils/primaryMenuPaths";
import { normalizePath, buildPathWithRole } from "@/utils/routeUtils";
import { useAuthStore } from "@/stores/useAuthStore";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { role, permissions } = useAuthStore();
  const normalized = normalizePath(pathname);

  if (!role) return null;

  const handleClick = (href?: string) => {
    if (!href) return;
    router.push(buildPathWithRole(role, href));
  };

  const handleLogout = () => {
    console.log("Logout...");
  };

  const filteredMenuItems = primaryMenuPaths.filter((item) => {
    if (!item.roles.includes(role)) {
      return false;
    }

    if (role === "employee" && item.permissionKey) {
      if (!permissions[item.permissionKey]) {
        return false;
      }
    }
    return true;
  });

  const MenuItems = (
    <nav className="space-y-1">
      {filteredMenuItems.map((item, index) => {
        const isActive = item.href && normalized.startsWith(item.href);

        return (
          <Button
            key={index}
            onClick={() => handleClick(item.href)}
            variant={isActive ? "default" : "ghost"}
            className={`w-full justify-start text-md py-3 font-medium ${
              isActive
                ? "bg-[#3C50E0] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-8 h-8 mr-2" />
            {item.name}
          </Button>
        );
      })}
    </nav>
  );

  const SidebarBase = (
    <aside className="h-full w-64 bg-[#F9F9F9] border-r border-[#E4E4E4] flex flex-col p-4">
      <div className="flex justify-center mb-4">
        <Logo size={170} />
      </div>
      <Separator className="w-full absolute bg-[#E4E4E4] mb-10 lg:my-12" />
      <div className="lg:mt-5">{MenuItems}</div>
    </aside>
  );

  const SidebarMobile = (
    <aside className="h-full w-64 bg-[#F9F9F9] border-r border-[#E4E4E4] flex flex-col p-4">
      <div className="flex justify-center mb-4">
        <Logo size={170} />
      </div>
      <Separator className="w-full bg-[#E4E4E4] mb-4" />
      <div className="flex-1">{MenuItems}</div>
      <Separator className="w-full bg-[#E4E4E4] my-4" />
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="w-full justify-start text-md py-3 font-medium text-red-600 hover:bg-red-50"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Sair
      </Button>
    </aside>
  );

  return (
    <>
      <div className="flex items-center justify-between lg:hidden px-4 py-3 border-b border-[#E4E4E4] bg-white">
        <Logo size={140} />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6 text-gray-700" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-64">
            {SidebarMobile}
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:flex">{SidebarBase}</div>
    </>
  );
}
