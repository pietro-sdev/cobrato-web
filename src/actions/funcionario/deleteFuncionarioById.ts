"use server";

import { prisma } from "@/lib/prisma";

export async function deleteFuncionarioById(userId: string, cnpj: string) {
  try {
    console.log("📌 Recebido para exclusão:", { userId, cnpj });

    const funcionario = await prisma.usuario.findUnique({
      where: { id: userId },
      include: { empresa: true },
    });

    console.log("👤 Funcionário encontrado:", funcionario);

    if (!funcionario || funcionario.empresa?.cnpj !== cnpj) {
      return {
        success: false,
        error: "Funcionário não encontrado ou não pertence à empresa.",
      };
    }

    await prisma.usuario.delete({
      where: { id: userId },
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Erro ao excluir funcionário:", error);
    return { success: false, error: "Erro interno ao excluir funcionário." };
  }
}
