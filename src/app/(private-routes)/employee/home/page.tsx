"use client";

import { MetricCard } from "@/components/layout/CardsSuperAdmin";
import { GenericTable } from "@/components/layout/TableGeneric";
import { CobrancaChart } from "@/components/layout/CobrancaChart";

const boletos = [
  {
    id: "3e75b604-41cb-4643",
    banco: "Sicoob (756)",
    valor: "R$ 360,00",
    status: "Pago",
    vencimento: "25/02/2025",
  },
  {
    id: "3e75b604-41cb-4643",
    banco: "Sicoob (756)",
    valor: "R$ 360,00",
    status: "Em Andamento",
    vencimento: "25/02/2025",
  },
  {
    id: "3e75b604-41cb-4643",
    banco: "Sicoob (756)",
    valor: "R$ 360,00",
    status: "Em Andamento",
    vencimento: "25/02/2025",
  },
  {
    id: "3e75b604-41cb-4643",
    banco: "Sicoob (756)",
    valor: "R$ 360,00",
    status: "Em Andamento",
    vencimento: "25/02/2025",
  },
  {
    id: "3e75b604-41cb-4643",
    banco: "Sicoob (756)",
    valor: "R$ 360,00",
    status: "Em Andamento",
    vencimento: "25/02/2025",
  },
];

const boletoColumns = [
  { key: "id", label: "ID do Boleto", isBold: true },
  { key: "banco", label: "Banco Emissor" },
  { key: "valor", label: "Valor" },
  { key: "status", label: "Status", isStatus: true },
  { key: "vencimento", label: "Vencimento" },
];

export default function Page() {
  return (
    <div>
      <h1 className="text-4xl font-bold leading-none">
        Olá Pietro <span className="inline-block">👋🏻</span>
      </h1>
      <h2 className="text-xl text-gray-500">
        Essas são as métricas da Cobrato de hoje!
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mt-5">
        <MetricCard
          title="Total de Cobranças Geradas"
          value="8650"
          percentageChange="45%"
        />
        <MetricCard
          title="Total de Cobranças Pagas"
          value="12350"
          percentageChange="45%"
        />
        <MetricCard
          title="Total de Receita do Mês"
          value="R$ 86.560,00"
          percentageChange="45%"
        />
      </div>

      <div className="mt-8">
        <CobrancaChart />
      </div>

      <div className="mt-8">
        <GenericTable
          data={boletos}
          columns={boletoColumns}
          onRowClick={(item) => {
            const id = item.id;
            window.location.href = `/admin/cobrancas-emitidas/${id}`;
          }}
        />
      </div>
    </div>
  );
}
