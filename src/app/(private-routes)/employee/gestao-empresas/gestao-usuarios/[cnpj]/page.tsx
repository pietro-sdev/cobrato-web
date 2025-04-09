"use client";

import { useParams } from "next/navigation";
import { GenericTable } from "@/components/layout/TableGeneric";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const mockUsers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@empresa.com",
    role: "Administrador",
    createdAt: "01/01/2024",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria@empresa.com",
    role: "Financeiro",
    createdAt: "15/02/2024",
  },
  {
    id: "3",
    name: "Carlos Lima",
    email: "carlos@empresa.com",
    role: "Suporte",
    createdAt: "10/03/2024",
  },
];

const columns = [
  { key: "name", label: "Nome", isBold: true },
  { key: "email", label: "Email" },
  { key: "role", label: "Cargo" },
  { key: "createdAt", label: "Data de Cadastro" },
];

export default function GestaoUsuariosPage() {
  const { cnpj } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold leading-none">Gestão de Usuários</h1>
        <Link href={`/gestao-empresas/gestao-usuarios/${cnpj}/adicionar`}>
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Adicionar Usuário
          </Button>
        </Link>
      </div>

      <h2 className="text-xl text-gray-500">
        Veja abaixo os administradores vinculados à empresa <span className="font-semibold">{formatCNPJ(cnpj)}</span>.
      </h2>

      <div className="mt-5">
        <GenericTable
          data={mockUsers}
          columns={columns}
          onRowClick={(item) => {
            const userId = item.id;
            window.location.href = `/gestao-empresas/gestao-usuarios/${cnpj}/${userId}`;
          }}
        />
      </div>
    </div>
  );
}

function formatCNPJ(cnpj: string | string[] | undefined) {
  if (!cnpj || typeof cnpj !== "string") return "";
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}
