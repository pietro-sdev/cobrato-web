"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UserPlus2Icon } from "lucide-react";
import Link from "next/link";

// Mock de empresa apenas para visual
const mockCompany = {
  name: "Block Code",
  cnpj: "49.002.002/0002-06",
  phone: "(11) 98014-1941",
  email: "contato@blockcode.com.br",
  cep: "03000-000",
  street: "Rua Exemplo",
  number: "123",
  neighborhood: "Centro",
  city: "São Paulo",
  state: "SP",
  responsavel: "João Silva",
  segment: "Tecnologia",
  status: "Ativo",
  registrationDate: "25/02/2025",
};

export default function EmpresaPage() {
  const params = useParams();
  const cnpjParam = params.cnpj;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Gestão de Empresa</h1>

        <Link href={`/gestao-empresas/gestao-usuarios/${cnpjParam}`}>
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
        <ReadOnlyInput label="Nome da Empresa" value={mockCompany.name} />
        <ReadOnlyInput label="CNPJ" value={mockCompany.cnpj} />
        <ReadOnlyInput label="Telefone" value={mockCompany.phone} />
        <ReadOnlyInput label="Email" value={mockCompany.email} />
        <ReadOnlyInput label="Data de Cadastro" value={mockCompany.registrationDate} />
        <ReadOnlyInput label="Responsável" value={mockCompany.responsavel} />
        <ReadOnlyInput label="Segmento" value={mockCompany.segment} />
        <ReadOnlyInput label="Status" value={mockCompany.status} />
        <ReadOnlyInput label="CEP" value={mockCompany.cep} />
        <ReadOnlyInput label="Rua" value={mockCompany.street} />
        <ReadOnlyInput label="Número" value={mockCompany.number} />
        <ReadOnlyInput label="Bairro" value={mockCompany.neighborhood} />
        <ReadOnlyInput label="Cidade" value={mockCompany.city} />
        <ReadOnlyInput label="Estado" value={mockCompany.state} />
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
