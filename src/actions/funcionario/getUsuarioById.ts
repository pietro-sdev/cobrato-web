"use server";

import { prisma } from "@/lib/prisma";

export async function getUsuarioById(id: string) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: {
        permissoes: true,
      },
    });

    if (!usuario) {
      return { success: false, error: "Usuário não encontrado." };
    }

    const permissoes = usuario.permissoes[0];
    const permissionsList: string[] = [];

    if (permissoes?.visualizarCobrancas) permissionsList.push("view_charges");
    if (permissoes?.emitirBoletos) permissionsList.push("create_charges");
    if (permissoes?.recorrencia) permissionsList.push("recurrence");
    if (permissoes?.baixaManual) permissionsList.push("manual_payment");
    if (permissoes?.cancelarCobranca) permissionsList.push("cancel_charges");
    if (permissoes?.acessoRelatorios) permissionsList.push("reports");
    if (permissoes?.configurarBoletos) permissionsList.push("config_boleto");

    return {
      success: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        role: usuario.role,
        createdAt: usuario.createdAt,
        permissions: permissionsList,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return { success: false, error: "Erro interno ao buscar usuário." };
  }
}
