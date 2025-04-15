"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { MetricCard } from "@/components/layout/CardsSuperAdmin";
import { GenericTable } from "@/components/layout/TableGeneric";
import { getEmpresaDashboard } from "@/actions/dashboard/getEmpresaMetrics";

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
];

const boletoColumns = [
  { key: "id", label: "ID do Boleto", isBold: true },
  { key: "banco", label: "Banco Emissor" },
  { key: "valor", label: "Valor" },
  { key: "status", label: "Status", isStatus: true },
  { key: "vencimento", label: "Vencimento" },
];

export default function Page() {
  const { nome, cnpj } = useAuthStore();
  const [dashboardData, setDashboardData] = useState({
    totalCobrancas: 0,
    cobrancasPagas: 0,
    receitaMensal: 0,
  });

  useEffect(() => {
    async function fetchData() {
      if (!cnpj) return;
      const data = await getEmpresaDashboard(cnpj);
      if (data) setDashboardData(data);
    }
    fetchData();
  }, [cnpj]);

  return (
    <div>
      <h1 className="text-4xl font-bold leading-none">
        Olá {nome} <span className="inline-block">👋🏻</span>
      </h1>
      <h2 className="text-xl text-gray-500">
        Essas são as métricas da Cobrato de hoje!
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mt-5">
        <MetricCard
          title="Total de Cobranças Geradas"
          value={dashboardData.totalCobrancas.toString()}
          percentageChange=""
        />
        <MetricCard
          title="Total de Cobranças Pagas"
          value={dashboardData.cobrancasPagas.toString()}
          percentageChange=""
        />
        <MetricCard
          title="Total de Receita do Mês"
          value={`R$ ${dashboardData.receitaMensal.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          percentageChange=""
        />
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
