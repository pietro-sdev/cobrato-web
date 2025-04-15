import {
  Home,
  FileText,
  Briefcase,
  Building,
  Settings,
  Users2,
  Repeat,
  Banknote,
} from "lucide-react";

// Defina os possíveis papéis
type Role = "super_admin" | "admin" | "employee";

// Defina as chaves de permissões que existem no seu sistema
interface UserPermissions {
  visualizarCobrancas: boolean;
  emitirBoletos: boolean;
  cancelarCobranca: boolean;
  recorrencia: boolean;
  configurarBoletos: boolean;
  acessoRelatorios: boolean;
  baixaManual: boolean;
}

// Interface do item de menu
interface MenuItem {
  name: string;
  icon: any;          // ou, para mais precisão, React.ComponentType<React.SVGProps<SVGSVGElement>>
  href: string;
  roles: Role[];      // quais roles têm acesso
  permissionKey?: keyof UserPermissions; // opcional, mas deve ser chave de UserPermissions
}

// Agora tipamos a lista de menu como MenuItem[]
export const primaryMenuPaths: MenuItem[] = [
  {
    name: "Dashboard",
    icon: Home,
    href: "/home",
    roles: ["super_admin", "admin", "employee"],
  },
  {
    name: "Cobranças Emitidas",
    icon: FileText,
    href: "/cobrancas-emitidas",
    roles: ["super_admin", "admin", "employee"],
    permissionKey: "visualizarCobrancas",
  },
  {
    name: "Cobranças Pagas",
    icon: FileText,
    href: "/cobrancas-pagas",
    roles: ["super_admin", "admin", "employee"],
    permissionKey: "visualizarCobrancas",
  },
  {
    name: "Gestão de Empresas",
    icon: Briefcase,
    href: "/gestao-empresas",
    roles: ["super_admin"],
  },
  {
    name: "Adicionar Empresas",
    icon: Building,
    href: "/adicionar-empresa",
    roles: ["super_admin"],
  },
  {
    name: "Gestão de Cobranças",
    icon: Banknote,
    href: "/gestao-cobrancas",
    roles: ["admin", "employee"],
    permissionKey: "emitirBoletos",
  },
  {
    name: "Gestão de Funcionários",
    icon: Users2,
    href: "/gestao-funcionarios",
    roles: ["admin"],
  },
  {
    name: "Gestão de Recorrências",
    icon: Repeat,
    href: "/gestao-recorrencias",
    roles: ["admin"],
    permissionKey: "recorrencia",
  },
  {
    name: "Configurações",
    icon: Settings,
    href: "/configuracoes",
    roles: ["super_admin", "admin"],
  },
  {
    name: "Configurar Bancos",
    icon: Banknote,
    href: "/configurar-banco",
    roles: ["admin"],
    permissionKey: "configurarBoletos",
  },
  {
    name: "Mensagem de Boleto",
    icon: FileText,
    href: "/mensagem-boleto",
    roles: ["admin"],
    permissionKey: "emitirBoletos",
  },
  
];
