"use server";

import { prisma } from "@/lib/prisma";

export async function listarCobrancasPorEmpresa(cnpj: string) {
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { cnpj },
      include: {
        cobrancas: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!empresa) {
      return { success: false, error: "Empresa não encontrada." };
    }

    const cobrancas = empresa.cobrancas.map((c) => ({
      id: c.id,
      company: empresa.nome,
      amount: `R$ ${c.valor.toFixed(2).replace(".", ",")}`,
      status: c.status,
      dueDate: new Date(c.vencimento).toLocaleDateString("pt-BR"),
    }));

    return { success: true, data: cobrancas };
  } catch (error) {
    console.error("Erro ao listar cobranças:", error);
    return { success: false, error: "Erro ao buscar cobranças." };
  }
}
