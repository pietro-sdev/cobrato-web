"use client";

import { Input } from "@/components/ui/search";
import { Search, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/auth/logout"; // 👈 importa a action
import { useTransition } from "react";

export default function TopHeader() {
  const { nome, foto } = useAuthStore();
  const [isPending, startTransition] = useTransition();

  return (
    <header className="hidden lg:flex items-center justify-between px-6 py-3 bg-white border-b w-full">
      <div className="flex items-center border rounded-md px-3 w-[300px] sm:w-[400px] lg:w-[500px] border-[#3C50E0]">
        <Search className="w-5 h-5 text-[#3C50E0]" />
        <Input
          type="text"
          placeholder="Pesquisar"
          className="border-none focus:ring-0 px-2 placeholder:text-[#8897AD] w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar>
                <AvatarImage
                  src={foto || "/user-avatar.png"}
                  alt="Usuário"
                />
                <AvatarFallback>{nome.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-gray-700 font-medium">{nome}</span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="border-[#E4E4E4] w-40 mt-2 shadow-md bg-white border rounded-md p-1"
          >
            <DropdownMenuItem
              className="border-[#E4E4E4] flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={() => startTransition(() => logout())}
            >
              <LogOut className="w-4 h-4" />
              <span>{isPending ? "Saindo..." : "Sair"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
