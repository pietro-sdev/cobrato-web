"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GenericTable } from "@/components/layout/TableGeneric";
import { PlusIcon, Repeat2, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const mockCobrancas = [
  {
    id: "1",
    cliente: "João Silva",
    valor: "R$ 360,00",
    status: "Pendente",
    vencimento: "25/04/2025",
  },
  {
    id: "2",
    cliente: "Maria Oliveira",
    valor: "R$ 180,00",
    status: "Pago",
    vencimento: "22/04/2025",
  },
  {
    id: "3",
    cliente: "Empresa XPTO",
    valor: "R$ 1.200,00",
    status: "Vencido",
    vencimento: "18/03/2025",
  },
];

const columns = [
  { key: "id", label: "ID", isBold: true },
  { key: "cliente", label: "Cliente" },
  { key: "valor", label: "Valor" },
  { key: "status", label: "Status", isStatus: true },
  { key: "vencimento", label: "Vencimento" },
  {
    key: "actions",
    label: "Ações",
    render: (item: any) => (
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-2"
        onClick={(e) => {
          e.stopPropagation();
          alert(`Baixando boleto para cobrança: ${item.id}`);
        }}
      >
        <Download className="w-4 h-4" />
        Baixar
      </Button>
    ),
  },
];

export default function GestaoCobrancasPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Gestão de Cobranças</h1>
          <p className="text-gray-500 text-lg">
            Acompanhe, crie e gerencie suas cobranças avulsas e recorrentes.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/admin/gestao-cobrancas/emissao")}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Nova Cobrança
          </Button>
        </div>
      </div>

      <Separator />

      <div className="mt-5">
        <GenericTable
          data={mockCobrancas}
          columns={columns}
          enableActions
          onRowClick={(item) =>
            router.push(`/admin/gestao-cobrancas/${item.id}`)
          }
        />
      </div>
    </div>
  );
}
