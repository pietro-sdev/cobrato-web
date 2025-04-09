"use client";

import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const mockBoleto = {
  id: "3e75b604-41cb-4643",
  banco: "Sicoob (756)",
  valor: "R$ 360,00",
  status: "Pago",
  vencimento: "25/02/2025",
  emissor: "Empresa XYZ",
  sacado: "João da Silva",
  descricao: "Pagamento de serviço mensal",
  linhaDigitavel: "00190.00009 01234.567899 01234.567890 1 23450000036000",
};

export default function DetalhesBoletoPage() {
  const { id } = useParams();

  const handleDownload = () => {
    alert(`Baixando boleto com ID: ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Detalhes do Boleto</h1>
          <p className="text-gray-500 text-xl">
            ID: <span className="font-semibold">{id}</span>
          </p>
        </div>

        <Button
          variant="outline"
          className="flex items-center gap-2 border border-[#E4E4E4]"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" />
          Baixar Boleto
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReadOnlyInput label="Banco Emissor" value={mockBoleto.banco} />
        <ReadOnlyInput label="Valor" value={mockBoleto.valor} />
        <ReadOnlyBadge label="Status" status={mockBoleto.status} />
        <ReadOnlyInput label="Vencimento" value={mockBoleto.vencimento} />
        <ReadOnlyInput label="Emissor" value={mockBoleto.emissor} />
        <ReadOnlyInput label="Sacado" value={mockBoleto.sacado} />
        <ReadOnlyInput label="Descrição" value={mockBoleto.descricao} />
        <ReadOnlyInput label="Linha Digitável" value={mockBoleto.linhaDigitavel} />
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

function ReadOnlyBadge({ label, status }: { label: string; status: string }) {
  const statusColors: Record<"Pago" | "Em Andamento" | "Pendente" | "Vencido", string> = {
    Pago: "bg-green-100 text-green-700",
    "Em Andamento": "bg-yellow-100 text-yellow-700",
    Pendente: "bg-orange-100 text-orange-700",
    Vencido: "bg-red-100 text-red-700",
  };

  const statusClass = statusColors[status as keyof typeof statusColors] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="space-y-1">
      <p className="text-sm text-black font-semibold">{label}</p>
      <Badge className={`w-fit px-3 py-1 text-sm font-medium ${statusClass}`}>
        {status}
      </Badge>
    </div>
  );
}
