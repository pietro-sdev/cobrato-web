import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = "admin@cobrato.com";
  const existing = await prisma.usuario.findUnique({ where: { email } });

  if (existing) {
    console.log("✅ Super admin já existe.");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.usuario.create({
    data: {
      nome: "Super Admin",
      email,
      telefone: "(11) 99999-9999",
      senha: hashedPassword,
      role: "super_admin",
    },
  });

  console.log("🚀 Super admin criado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
