"use client";

import { GenericTable } from "@/components/layout/TableGeneric";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const charges = [
  {
    id: "3e75b604-41cb-4643",
    company: "Block Code",
    amount: "R$ 360,00",
    status: "Pago",
    dueDate: "25/02/2025",
  },
  {
    id: "3e75b604-41cb-4643",
    company: "Block Code",
    amount: "R$ 360,00",
    status: "Em andamento",
    dueDate: "25/02/2025",
  },
  {
    id: "3e75b604-41cb-4643",
    company: "Block Code",
    amount: "R$ 360,00",
    status: "Em andamento",
    dueDate: "25/02/2025",
  },
  {
    id: "3e75b604-41cb-4643",
    company: "Block Code",
    amount: "R$ 360,00",
    status: "Pendente",
    dueDate: "25/02/2025",
  },
  {
    id: "3e75b604-41cb-4643",
    company: "Block Code",
    amount: "R$ 360,00",
    status: "Pendente",
    dueDate: "25/02/2025",
  },
];

const chargeColumns = [
  { key: "id", label: "ID do Boleto" },
  { key: "company", label: "Empresa", isBold: true },
  { key: "amount", label: "Valor" },
  { key: "status", label: "Status", isStatus: true },
  { key: "dueDate", label: "Vencimento" },
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
          alert(`Baixando boleto: ${item.id}`);
        }}
      >
        <Download className="w-4 h-4" />
        Baixar
      </Button>
    ),
  },
];

export default function Page() {
  return (
    <div>
      <h1 className="text-4xl font-bold leading-none">Cobranças Pagas</h1>
      <h2 className="text-xl text-gray-500">
        Veja todas as cobranças emitidas!
      </h2>

      <div className="mt-5">
        <GenericTable
          data={charges}
          columns={chargeColumns}
          enableActions
          onRowClick={(item) => {
            const id = item.id;
            window.location.href = `/admin/cobrancas-pagas/${id}`;
          }}
        />
      </div>
    </div>
  );
}
