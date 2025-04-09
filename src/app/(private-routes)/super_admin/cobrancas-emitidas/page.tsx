"use client";

import { useEffect, useState } from "react";
import { GenericTable } from "@/components/layout/TableGeneric";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getAllCobrancasEmitidas } from "@/actions/cobranca/getAllCobrancasEmitidas";

const chargeColumns = [
  { key: "id", label: "ID do Boleto" },
  { key: "empresa", label: "Empresa", isBold: true },
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
  const [charges, setCharges] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCharges() {
      const data = await getAllCobrancasEmitidas();
      setCharges(data);
    }

    fetchCharges();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold leading-none">Cobranças Emitidas</h1>
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
            window.location.href = `/super_admin/cobrancas-emitidas/${id}`;
          }}
        />
      </div>
    </div>
  );
}
