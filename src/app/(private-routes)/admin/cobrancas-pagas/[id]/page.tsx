"use client";

import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const mockBoleto = {
  id: "3e75b604-aaa1",
  banco: "Sicoob (756)",
  valor: "R$ 360,00",
  status: "Pago",
  vencimento: "25/02/2025",
  empresa: "Block Code",
  descricao: "Cobrança de serviço mensal",
};

export default function BoletoPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Detalhes do Boleto</h1>
        <p className="text-gray-500 text-lg">Visualize as informações do boleto gerado</p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReadOnlyInput label="ID do Boleto" value={String(id)} />
        <ReadOnlyInput label="Banco Emissor" value={mockBoleto.banco} />
        <ReadOnlyInput label="Empresa" value={mockBoleto.empresa} />
        <ReadOnlyInput label="Valor" value={mockBoleto.valor} />
        <ReadOnlyStatus label="Status" status={mockBoleto.status} />
        <ReadOnlyInput label="Vencimento" value={mockBoleto.vencimento} />
        <ReadOnlyInput label="Descrição" value={mockBoleto.descricao} />
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

function ReadOnlyStatus({ label, status }: { label: string; status: string }) {
  const statusColors: Record<"Pago" | "Em Andamento" | "Pendente" | "Vencido", string> = {
    Pago: "bg-green-100 text-green-700",
    "Em Andamento": "bg-yellow-100 text-yellow-700",
    Pendente: "bg-orange-100 text-orange-700",
    Vencido: "bg-red-100 text-red-700",
  };

  const badgeClass = statusColors[status as keyof typeof statusColors] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="space-y-1">
      <p className="text-sm text-black font-semibold">{label}</p>
      <Badge className={`w-fit px-3 py-1 text-sm font-medium ${badgeClass}`}>
        {status}
      </Badge>
    </div>
  );
}
