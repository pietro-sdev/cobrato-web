"use server";

import { prisma } from "@/lib/prisma";

export async function getUsuariosByEmpresa(cnpj: string) {
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { cnpj },
      select: { id: true },
    });

    if (!empresa) {
      return { success: false, error: "Empresa não encontrada" };
    }
    const usuarios = await prisma.usuario.findMany({
      where: {
        empresaId: empresa.id,
      },
      include: {
        permissoes: true,
      },
    });

    return { success: true, usuarios };
  } catch (error) {
    return { success: false, error: "Erro interno ao buscar usuários" };
  }
}
