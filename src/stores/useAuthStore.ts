import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "super_admin" | "admin" | "employee";

// Definimos o tipo das permissões que vem do back
type UserPermissions = {
  visualizarCobrancas: boolean;
  emitirBoletos: boolean;
  cancelarCobranca: boolean;
  recorrencia: boolean;
  configurarBoletos: boolean;
  acessoRelatorios: boolean;
  baixaManual: boolean;
};

interface AuthState {
  id: string;
  email: string;
  nome: string;
  role: Role;
  cnpj: string;
  foto: string;
  isAuthenticated: boolean;

  // Adicionamos as permissões aqui
  permissions: UserPermissions;

  // Ajustamos o setUser para aceitar permissions
  setUser: (user: {
    id: string;
    email: string;
    nome: string;
    role: Role;
    cnpj: string;
    foto: string;
    permissions?: UserPermissions; // pode ser opcional
  }) => void;

  clear: () => void;
  updateFoto: (url: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      id: "",
      email: "",
      nome: "",
      role: "employee",
      cnpj: "",
      foto: "",
      isAuthenticated: false,

      // Inicializamos tudo como false
      permissions: {
        visualizarCobrancas: false,
        emitirBoletos: false,
        cancelarCobranca: false,
        recorrencia: false,
        configurarBoletos: false,
        acessoRelatorios: false,
        baixaManual: false,
      },

      setUser: (user) =>
        set({
          id: user.id,
          email: user.email,
          nome: user.nome,
          role: user.role,
          cnpj: user.cnpj,
          foto: user.foto,
          isAuthenticated: true,

          permissions: user.permissions ?? {
            visualizarCobrancas: false,
            emitirBoletos: false,
            cancelarCobranca: false,
            recorrencia: false,
            configurarBoletos: false,
            acessoRelatorios: false,
            baixaManual: false,
          },
        }),

      clear: () =>
        set({
          id: "",
          email: "",
          nome: "",
          role: "employee",
          cnpj: "",
          foto: "",
          isAuthenticated: false,
          permissions: {
            visualizarCobrancas: false,
            emitirBoletos: false,
            cancelarCobranca: false,
            recorrencia: false,
            configurarBoletos: false,
            acessoRelatorios: false,
            baixaManual: false,
          },
        }),

      updateFoto: (url: string) => set({ foto: url }),
    }),
    {
      name: "auth-storage",
    }
  )
);
