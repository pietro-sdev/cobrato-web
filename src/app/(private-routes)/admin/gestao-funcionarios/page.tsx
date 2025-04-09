"use client";

import { useEffect, useState } from "react";
import { GenericTable } from "@/components/layout/TableGeneric";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { getUsuariosByEmpresa } from "@/actions/funcionario/getUsuariosByEmpresa";
import { useAuthStore } from "@/stores/useAuthStore";

const columns = [
  { key: "nome", label: "Nome", isBold: true },
  { key: "email", label: "Email" },
  { key: "role", label: "Cargo" },
  { key: "createdAt", label: "Data de Cadastro" },
];

interface UsuarioFormatado {
  id: string;
  nome: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function GestaoUsuariosPage() {
  const cnpj = useAuthStore((state) => state.cnpj);
  const [usuarios, setUsuarios] = useState<UsuarioFormatado[]>([]);

  useEffect(() => {
    async function fetchUsuarios() {
      if (!cnpj) return;

      const res = await getUsuariosByEmpresa(cnpj);

      if (!res.success || !res.usuarios) return;

      const formatados = res.usuarios
        .filter((user) => user.role === "employee") 
        .map((user) => ({
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: formatarCargo(user.role),
          createdAt: new Date(user.createdAt).toLocaleDateString("pt-BR"),
        }));

      setUsuarios(formatados);
    }

    fetchUsuarios();
  }, [cnpj]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold leading-none">Gestão de Usuários</h1>
        <Link href={`/admin/gestao-funcionarios/adicionar`}>
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Adicionar Usuário
          </Button>
        </Link>
      </div>

      <h2 className="text-xl text-gray-500">
        Veja abaixo os funcionários vinculados à sua empresa.
      </h2>

      <div className="mt-5">
        <GenericTable
          data={usuarios}
          columns={columns}
          onRowClick={(item) => {
            const userId = item.id;
            window.location.href = `/admin/gestao-funcionarios/${userId}`;
          }}
        />
      </div>
    </div>
  );
}

function formatarCargo(role: string) {
  switch (role) {
    case "admin":
      return "Administrador";
    case "employee":
      return "Funcionário";
    case "super_admin":
      return "Super Admin";
    default:
      return role;
  }
}
