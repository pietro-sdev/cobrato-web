"use client";

import { useEffect, useState } from "react";
import { GenericTable } from "@/components/layout/TableGeneric";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { listarCobrancasPorEmpresa } from "@/actions/cobranca/listarCobrancasPorEmpresa";
import { useAuthStore } from "@/stores/useAuthStore";

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
  const { cnpj } = useAuthStore();
  const [charges, setCharges] = useState<any[]>([]);

  useEffect(() => {
    if (!cnpj) return;
    const fetchCharges = async () => {
      const result = await listarCobrancasPorEmpresa(cnpj);
      if (result.success) {
        setCharges(result.data ?? []);
      } else {
        console.error(result.error);
      }
    };

    fetchCharges();
  }, [cnpj]);

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
            window.location.href = `/admin/cobrancas-emitidas/${id}`;
          }}
        />
      </div>
    </div>
  );
}
