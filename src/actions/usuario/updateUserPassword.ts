"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function updateUserPassword(email: string, novaSenha: string) {
  try {
    const hashedPassword = await bcrypt.hash(novaSenha, 10);

    const usuario = await prisma.usuario.update({
      where: { email },
      data: {
        senha: hashedPassword,
      },
    });

    return { success: true, usuario };
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return { success: false, error: "Erro ao atualizar senha." };
  }
}
