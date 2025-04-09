"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardMetrics() {
  const now = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(now.getMonth() - 1);

  const [empresasAtual, empresasAnterior] = await Promise.all([
    prisma.empresa.count({
      where: { createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } },
    }),
    prisma.empresa.count({
      where: {
        createdAt: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(now.getFullYear(), now.getMonth(), 1),
        },
      },
    }),
  ]);

  const [cobrancasAtual, cobrancasAnterior] = await Promise.all([
    prisma.cobranca.count({
      where: { createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } },
    }),
    prisma.cobranca.count({
      where: {
        createdAt: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(now.getFullYear(), now.getMonth(), 1),
        },
      },
    }),
  ]);

  const [transacoesAtual, transacoesAnterior] = await Promise.all([
    prisma.cobranca.aggregate({
      _sum: { valor: true },
      where: {
        createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) },
        status: "pago",
      },
    }),
    prisma.cobranca.aggregate({
      _sum: { valor: true },
      where: {
        createdAt: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(now.getFullYear(), now.getMonth(), 1),
        },
        status: "pago",
      },
    }),
  ]);

  function calcularVariacao(atual: number, anterior: number): string {
    if (anterior === 0) {
      if (atual === 0) return "0%";
      return "100%";
    }
    return `${Math.round(((atual - anterior) / anterior) * 100)}%`;
  }
  

  const totalTransacoesAtual = transacoesAtual._sum.valor?.toNumber() ?? 0;
  const totalTransacoesAnterior = transacoesAnterior._sum.valor?.toNumber() ?? 0;

  return {
    empresas: {
      total: empresasAtual,
      variacao: calcularVariacao(empresasAtual, empresasAnterior),
    },
    cobrancas: {
      total: cobrancasAtual,
      variacao: calcularVariacao(cobrancasAtual, cobrancasAnterior),
    },
    transacoes: {
      total: totalTransacoesAtual,
      variacao: calcularVariacao(totalTransacoesAtual, totalTransacoesAnterior),
    },
  };
}
