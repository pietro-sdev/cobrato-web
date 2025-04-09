"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UserPlus2Icon } from "lucide-react";
import Link from "next/link";
import { getEmpresaByCnpj } from "@/actions/empresa/getEmpresaByCnpj";

interface EmpresaDetails {
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  responsavel: string;
  segment: string;
  status: string;
  registrationDate: string;
}

export default function EmpresaPage() {
  const { cnpj } = useParams();
  const [empresa, setEmpresa] = useState<EmpresaDetails | null>(null);

  useEffect(() => {
    async function fetchData() {
      const result = await getEmpresaByCnpj(cnpj as string);
      setEmpresa(result);
    }

    if (cnpj) fetchData();
  }, [cnpj]);

  if (!empresa) {
    return <p>Carregando dados da empresa...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Gestão de Empresa</h1>

        <Link href={`/super_admin/gestao-empresas/gestao-usuarios/${cnpj}`}>
          <Button className="hover:bg-[#f5f5f5] transition-colors flex items-center gap-2 border border-[#E4E4E4]" variant="outline">
            <UserPlus2Icon className="h-4 w-4" />
            Gestão de Usuários
          </Button>
        </Link>
      </div>

      <h2 className="text-xl -mt-10 text-gray-500">
        Visualize os dados da empresa cadastrada.
      </h2>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReadOnlyInput label="Nome da Empresa" value={empresa.name} />
        <ReadOnlyInput label="CNPJ" value={empresa.cnpj} />
        <ReadOnlyInput label="Telefone" value={empresa.phone} />
        <ReadOnlyInput label="Email" value={empresa.email} />
        <ReadOnlyInput label="Data de Cadastro" value={empresa.registrationDate} />
        <ReadOnlyInput label="Responsável" value={empresa.responsavel} />
        <ReadOnlyInput label="Segmento" value={empresa.segment} />
        <ReadOnlyInput label="Status" value={empresa.status} />
        <ReadOnlyInput label="CEP" value={empresa.cep} />
        <ReadOnlyInput label="Rua" value={empresa.street} />
        <ReadOnlyInput label="Número" value={empresa.number} />
        <ReadOnlyInput label="Complemento" value={empresa.complement ?? "-"} />
        <ReadOnlyInput label="Bairro" value={empresa.neighborhood} />
        <ReadOnlyInput label="Cidade" value={empresa.city} />
        <ReadOnlyInput label="Estado" value={empresa.state} />
      </div>
    </div>
  );
}

function ReadOnlyInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-black font-semibold">{label}</p>
      <Input value={value} disabled />
    </div>
  );
}
