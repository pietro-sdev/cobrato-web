"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, Download } from "lucide-react";
import { GenericTable } from "@/components/layout/TableGeneric";

const recorrencias = [
  {
    id: "r1",
    cliente: "João Silva",
    valor: "R$ 120,00",
    ciclo: "Mensal",
    proximaCobranca: "10/05/2025",
    status: "Ativo",
  },
  {
    id: "r2",
    cliente: "Empresa XPTO",
    valor: "R$ 750,00",
    ciclo: "Mensal",
    proximaCobranca: "01/05/2025",
    status: "Ativo",
  },
  {
    id: "r3",
    cliente: "Maria Oliveira",
    valor: "R$ 180,00",
    ciclo: "Trimestral",
    proximaCobranca: "15/06/2025",
    status: "Inativo",
  },
];

const columns = [
  { key: "cliente", label: "Cliente", isBold: true },
  { key: "valor", label: "Valor" },
  { key: "ciclo", label: "Ciclo" },
  { key: "proximaCobranca", label: "Próxima Cobrança" },
  { key: "status", label: "Status", isStatus: true },
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
          alert(`Ação sobre recorrência: ${item.id}`);
        }}
      >
        <Download className="w-4 h-4" />
        Baixar
      </Button>
    ),
  },
];

export default function RecorrenciasPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Cobranças Recorrentes</h1>
          <p className="text-gray-500 text-lg">
            Visualize e gerencie suas cobranças automáticas.
          </p>
        </div>

        <Button
          onClick={() => router.push("/admin/gestao-recorrencias/adicionar")}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Adicionar Recorrência
        </Button>
      </div>

      <Separator />

      <GenericTable
        data={recorrencias}
        columns={columns}
        enableActions
        onRowClick={(item) =>
          router.push(`/admin/gestao-recorrencias/${item.id}`)
        }
      />
    </div>
  );
}
