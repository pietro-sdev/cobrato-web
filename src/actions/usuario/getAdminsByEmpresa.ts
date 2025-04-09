"use server";

import { prisma } from "@/lib/prisma";

export async function getAdminsByEmpresa(cnpj: string) {
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { cnpj },
      include: {
        usuarios: {
          where: { role: "admin" },
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            createdAt: true,
          },
        },
      },
    });

    if (!empresa) return [];

    const admins = empresa.usuarios.map((usuario) => ({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      createdAt: new Date(usuario.createdAt).toLocaleDateString("pt-BR"),
    }));

    return admins;
  } catch (error) {
    console.error("Erro ao buscar administradores:", error);
    return [];
  }
}
