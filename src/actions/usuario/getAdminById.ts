"use server";

import { prisma } from "@/lib/prisma";

export async function getAdminById(userId: string) {
  try {
    console.log("🔍 Buscando admin por ID:", userId); // Log adicionado

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        createdAt: true,
        empresa: {
          select: { cnpj: true },
        },
      },
    });

    if (!usuario) {
      console.warn("⚠️ Nenhum usuário encontrado com este ID:", userId);
      return null;
    }

    const result = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      empresaCnpj: usuario.empresa?.cnpj || "",
      createdAt: usuario.createdAt.toLocaleDateString("pt-BR"),
    };

    console.log("✅ Admin encontrado:", result);
    return result;
  } catch (error) {
    console.error("❌ Erro ao buscar administrador:", error);
    return null;
  }
}
