  "use server"

  import { prisma } from "@/lib/prisma"

  export async function verifyResetCode(email: string, code: string) {
    const record = await prisma.passwordReset.findUnique({
      where: { email },
    })

    if (!record || record.code !== code) {
      return { error: "Código inválido" }
    }

    if (record.expiresAt < new Date()) {
      return { error: "Código expirado" }
    }

    return { success: true }
  }
