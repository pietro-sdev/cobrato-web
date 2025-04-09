"use server";

import { prisma } from "@/lib/prisma";

export async function updateUserPhoto(email: string, photoUrl: string) {
  try {
    await prisma.usuario.update({
      where: { email },
      data: { foto: photoUrl },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar foto:", error);
    return { success: false, error: "Erro ao atualizar a foto" };
  }
}
