"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GenericTable } from "@/components/layout/TableGeneric";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { getAdminsByEmpresa } from "@/actions/usuario/getAdminsByEmpresa";

const columns = [
  { key: "nome", label: "Nome", isBold: true },
  { key: "email", label: "Email" },
  { key: "createdAt", label: "Data de Cadastro" },
];

export default function GestaoUsuariosPage() {
  const { cnpj } = useParams();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      if (!cnpj || typeof cnpj !== "string") return;
      const result = await getAdminsByEmpresa(cnpj);
      setUsers(result);
    }

    fetchUsers();
  }, [cnpj]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold leading-none">Gestão de Usuários</h1>
        <Link href={`/super_admin/gestao-empresas/gestao-usuarios/${cnpj}/adicionar`}>
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Adicionar Usuário
          </Button>
        </Link>
      </div>

      <h2 className="text-xl text-gray-500">
        Veja abaixo os administradores vinculados à empresa{" "}
        <span className="font-semibold">{formatCNPJ(cnpj)}</span>.
      </h2>

      <div className="mt-5">
        <GenericTable
          data={users}
          columns={columns}
          onRowClick={(item) => {
            console.log("ITEM AO CLICAR:", item);
            const userId = item.id;
            window.location.href = `/super_admin/gestao-empresas/gestao-usuarios/${cnpj}/${userId}`;
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
