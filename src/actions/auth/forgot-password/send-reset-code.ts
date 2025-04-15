"use server"

import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email/sendEmail"
import { generateSixDigitCode } from "@/lib/code-generator"

export async function sendResetCode(email: string) {
  const user = await prisma.usuario.findUnique({ where: { email } });

  if (!user) {
    return { error: "Usuário não encontrado com esse e-mail." };
  }

  const code = generateSixDigitCode();

  await prisma.passwordReset.deleteMany({
    where: { email },
  });

  await prisma.passwordReset.create({
    data: {
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), 
    },
  });

  await sendEmail({
    to: email,
    subject: "Código de recuperação de senha",
    html: `Seu código de verificação é: <strong>${code}</strong>`,
  });

  return { success: true };
}

