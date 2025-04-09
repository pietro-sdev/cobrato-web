"use server";

import { prisma } from "@/lib/prisma";

export async function getCobrancasPagas() {
  try {
    const cobrancas = await prisma.cobranca.findMany({
      where: { status: "pago" },
      include: {
        empresa: {
          select: { nome: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return cobrancas.map((cobranca) => ({
      id: cobranca.id,
      company: cobranca.empresa.nome,
      amount: `R$ ${Number(cobranca.valor).toFixed(2).replace('.', ',')}`,
      status: "Pago",
      dueDate: new Date(cobranca.vencimento).toLocaleDateString("pt-BR"),
    }));
  } catch (error) {
    console.error("Erro ao buscar cobranças pagas:", error);
    return [];
  }
}
