"use server";

import { prisma } from "@/lib/prisma";

export async function getUsuarioByEmail(email: string) {
  try {
    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}
