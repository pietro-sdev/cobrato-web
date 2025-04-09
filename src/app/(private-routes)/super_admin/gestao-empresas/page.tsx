"use client";

import { useEffect, useState } from "react";
import { GenericTable } from "@/components/layout/TableGeneric";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { getEmpresas } from "@/actions/empresa/getEmpresa";

const columns = [
  { key: "name", label: "Nome da Empresa", isBold: true },
  { key: "cnpj", label: "CNPJ" },
  { key: "phone", label: "Telefone" },
  { key: "registrationDate", label: "Data de Cadastro" },
];

export default function Page() {
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCompanies() {
      const data = await getEmpresas();
      setCompanies(data);
    }
    fetchCompanies();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold leading-none">Gestão de Empresas</h1>

        <div className="flex gap-2">
          <Link href="/super_admin/adicionar-empresa">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Adicionar Empresa
            </Button>
          </Link>
        </div>
      </div>

      <h2 className="text-xl text-gray-500 mt-1">
        Visualize todas as empresas cadastradas.
      </h2>

      <div className="mt-5">
        <GenericTable
          data={companies}
          columns={columns}
          onRowClick={(item) => {
            const cleanCnpj = item.cnpj?.replace(/\D/g, "");
            window.location.href = `/super_admin/gestao-empresas/${cleanCnpj}`;
          }}
        />
      </div>
    </div>
  );
}
