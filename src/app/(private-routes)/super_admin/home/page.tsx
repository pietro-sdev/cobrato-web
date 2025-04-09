"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { getDashboardMetrics } from "@/actions/dashboard/getMetrics";
import { getEmpresas } from "@/actions/empresa/getEmpresa";
import { MetricCard } from "@/components/layout/CardsSuperAdmin";
import { GenericTable } from "@/components/layout/TableGeneric";

const companyColumns = [
  { key: "name", label: "Nome da Empresa", isBold: true },
  { key: "cnpj", label: "CNPJ" },
  { key: "phone", label: "Telefone" },
  { key: "status", label: "Status", isStatus: true },
  { key: "registrationDate", label: "Data de Cadastro" },
];

export default function Page() {
  const { nome, isAuthenticated, setUser } = useAuthStore();
  const [metrics, setMetrics] = useState({
    empresas: { total: 0, variacao: "0%" },
    cobrancas: { total: 0, variacao: "0%" },
    transacoes: { total: 0, variacao: "0%" },
  });

  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUser() {
      if (!isAuthenticated) {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const user = await response.json();
          setUser(user);
        } else {
          console.error("Falha ao obter dados do usuário");
        }
      }
    }

    fetchUser();
  }, [isAuthenticated, setUser]);

  useEffect(() => {
    async function fetchMetrics() {
      const data = await getDashboardMetrics();
      setMetrics(data);
    }

    fetchMetrics();
  }, []);

  useEffect(() => {
    async function fetchEmpresas() {
      const data = await getEmpresas();
      setCompanies(data);
    }

    fetchEmpresas();
  }, []);

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
          title="Total de Empresas Cadastradas"
          value={metrics.empresas.total.toString()}
          percentageChange={metrics.empresas.variacao}
        />
        <MetricCard
          title="Total de Cobranças Cadastradas"
          value={metrics.cobrancas.total.toString()}
          percentageChange={metrics.cobrancas.variacao}
        />
        <MetricCard
          title="Total de Transações Realizadas"
          value={`R$ ${metrics.transacoes.total.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          percentageChange={metrics.transacoes.variacao}
        />
      </div>

      <div className="mt-8">
        <GenericTable
          data={companies}
          columns={companyColumns}
          onRowClick={(item) => {
            const cnpj = item.cnpj.replace(/\D/g, "");
            window.location.href = `/super_admin/gestao-empresas/${cnpj}`;
          }}
        />
      </div>
    </div>
  );
}
