"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

interface UserPermissions {
  visualizarCobrancas: boolean;
  emitirBoletos: boolean;
  cancelarCobranca: boolean;
  recorrencia: boolean;
  configurarBoletos: boolean;
  acessoRelatorios: boolean;
  baixaManual: boolean;
}

interface AuthProviderProps {
  user: {
    id: string;
    email: string;
    nome: string;
    role: "super_admin" | "admin" | "employee";
    cnpj: string;
    foto: string;
    permissions?: UserPermissions;
  };
}


function mergePermissions(
  p?: UserPermissions
): UserPermissions {
  return {
    visualizarCobrancas: p?.visualizarCobrancas ?? false,
    emitirBoletos: p?.emitirBoletos ?? false,
    cancelarCobranca: p?.cancelarCobranca ?? false,
    recorrencia: p?.recorrencia ?? false,
    configurarBoletos: p?.configurarBoletos ?? false,
    acessoRelatorios: p?.acessoRelatorios ?? false,
    baixaManual: p?.baixaManual ?? false,
  };
}

export function AuthProvider({ user }: AuthProviderProps) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      setUser({
        ...user,
        permissions: mergePermissions(user.permissions),
      });
    } else {
      router.push("/login");
    }
  }, [user, router, setUser]);

  return null;
}
