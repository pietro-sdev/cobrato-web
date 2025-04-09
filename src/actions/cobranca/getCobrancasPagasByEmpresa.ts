"use server";

import { prisma } from "@/lib/prisma";

export async function getCobrancasPagasByEmpresa(cnpj: string) {
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { cnpj },
      select: { id: true },
    });

    if (!empresa) {
      return { success: false, error: "Empresa não encontrada." };
    }

    const cobrancasPagas = await prisma.cobranca.findMany({
      where: {
        empresaId: empresa.id,
        status: "pago",
      },
      orderBy: { vencimento: "desc" },
    });

    return { success: true, cobrancas: cobrancasPagas };
  } catch (error) {
    console.error("Erro ao buscar cobranças pagas:", error);
    return { success: false, error: "Erro interno ao buscar cobranças." };
  }
}
