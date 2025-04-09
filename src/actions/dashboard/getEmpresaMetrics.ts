"use server";

import { prisma } from "@/lib/prisma";

export async function getEmpresaDashboard(cnpj: string) {
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { cnpj },
      select: { id: true },
    });

    if (!empresa) return null;

    const cobrancas = await prisma.cobranca.findMany({
      where: { empresaId: empresa.id },
    });

    const totalCobrancas = cobrancas.length;

    const cobrancasPagas = cobrancas.filter(
      (c) => c.status === "pago"
    ).length;

    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const receitaMensal = cobrancas
      .filter((c) => {
        return (
          c.status === "pago" &&
          c.vencimento >= primeiroDiaMes &&
          c.vencimento <= ultimoDiaMes
        );
      })
      .reduce((total, cobranca) => {
        return total + parseFloat(cobranca.valor.toString());
      }, 0);

    return {
      totalCobrancas,
      cobrancasPagas,
      receitaMensal,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard da empresa:", error);
    return null;
  }
}
