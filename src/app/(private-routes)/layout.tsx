import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, JWTPayload } from "jose";
import { AuthProvider } from "@/components/AuthProvider";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

interface JwtPermissions {
  visualizarCobrancas: boolean;
  emitirBoletos: boolean;
  cancelarCobranca: boolean;
  recorrencia: boolean;
  configurarBoletos: boolean;
  acessoRelatorios: boolean;
  baixaManual: boolean;
}

interface JwtPayload {
  id: string;
  email: string;
  nome: string;
  role: "super_admin" | "admin" | "employee";
  cnpj?: string;
  foto: string;
  permissions?: JwtPermissions;
}

function mergePermissions(p?: JwtPermissions): JwtPermissions {
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

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const typedPermissions = payload.permissions as JwtPermissions | undefined;

    user = {
      id: payload.id as string,
      email: payload.email as string,
      nome: payload.nome as string,
      cnpj: (payload.cnpj as string) || "",
      foto: (payload.foto as string) || "",
      role: payload.role as JwtPayload["role"],
      permissions: mergePermissions(typedPermissions),
    };
  } catch (error) {
    console.error("Erro ao validar token:", error);
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-[1500px] h-screen grid lg:grid-cols-[260px_1fr] bg-white overflow-hidden">
      <AuthProvider user={user} />

      <Sidebar />

      <div className="flex flex-col w-full overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto px-6 pb-12 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
