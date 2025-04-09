"use server";

import { prisma } from "@/lib/prisma";

export async function getAllCobrancasEmitidas() {
  try {
    const cobrancas = await prisma.cobranca.findMany({
      include: {
        empresa: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return cobrancas.map((cobranca) => ({
      id: cobranca.id,
      company: cobranca.empresa?.nome || "-",
      amount: `R$ ${Number(cobranca.valor).toFixed(2).replace('.', ',')}`,
      status: formatStatus(cobranca.status),
      dueDate: new Date(cobranca.vencimento).toLocaleDateString("pt-BR"),
    }));
  } catch (error) {
    console.error("Erro ao buscar cobranças emitidas:", error);
    return [];
  }
}

function formatStatus(status: string) {
  switch (status) {
    case "pago":
      return "Pago";
    case "pendente":
      return "Pendente";
    case "em_andamento":
      return "Em andamento";
    case "cancelado":
      return "Cancelado";
    case "vencido":
      return "Vencido";
    default:
      return status;
  }
}
