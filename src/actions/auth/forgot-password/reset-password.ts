"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function resetPassword(email: string, novaSenha: string) {
  const hash = await bcrypt.hash(novaSenha, 10)

  await prisma.usuario.update({
    where: { email },
    data: { senha: hash },
  })

  await prisma.passwordReset.delete({ where: { email } })

  return { success: true }
}
