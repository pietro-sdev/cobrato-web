"use client";

import { GenericTable } from "@/components/layout/TableGeneric";
import { Button } from "@/components/ui/button";
import { PlusIcon, UserPlus2Icon } from "lucide-react";
import Link from "next/link";

const companies = [
  {
    name: "Block Code",
    cnpj: "49.002.002/0002-06",
    phone: "(11) 98014-1941",
    registrationDate: "25/02/2025",
  },
  {
    name: "Block Code",
    cnpj: "49.002.002/0002-06",
    phone: "(11) 98014-1941",
    registrationDate: "25/02/2025",
  },
  {
    name: "Block Code",
    cnpj: "49.002.002/0002-06",
    phone: "(11) 98014-1941",
    registrationDate: "25/02/2025",
  },
  {
    name: "Block Code",
    cnpj: "49.002.002/0002-06",
    phone: "(11) 98014-1941",
    registrationDate: "25/02/2025",
  },
  {
    name: "Block Code",
    cnpj: "49.002.002/0002-06",
    phone: "(11) 98014-1941",
    registrationDate: "25/02/2025",
  },
];

const columns = [
  { key: "name", label: "Nome da Empresa", isBold: true },
  { key: "cnpj", label: "CNPJ" },
  { key: "phone", label: "Telefone" },
  { key: "registrationDate", label: "Data de Cadastro" },
];

export default function Page() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold leading-none">Cobranças Pagas</h1>

        <div className="flex gap-2">
          <Link href="/gestao-empresas/adicionar">
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
            window.location.href = `/gestao-empresas/${cleanCnpj}`;
          }}
        />
      </div>
    </div>
  );
}
