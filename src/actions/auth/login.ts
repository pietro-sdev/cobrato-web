"use server";

import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth/generate-token";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

interface LoginInput {
  email: string;
  senha: string;
}

type Role = "super_admin" | "admin" | "employee";

export async function login({ email, senha }: LoginInput) {
  // Busca o usuário e inclui permissoes + empresa
  const user = await prisma.usuario.findUnique({
    where: { email },
    include: {
      empresa: true,
      permissoes: true, // array de PermissaoFuncionario
    },
  });

  if (!user) {
    return { error: "Email ou senha inválidos" };
  }

  const senhaCorreta = await bcrypt.compare(senha, user.senha);
  if (!senhaCorreta) {
    return { error: "Email ou senha inválidos" };
  }

  const perm = user.permissoes.length ? user.permissoes[0] : null;

  const token = await generateToken({
    id: user.id,
    email: user.email,
    nome: user.nome,
    role: user.role,
    cnpj: user.empresa?.cnpj ?? "",
    foto: user.foto || "",
    permissions: {
      visualizarCobrancas: perm?.visualizarCobrancas || false,
      emitirBoletos: perm?.emitirBoletos || false,
      cancelarCobranca: perm?.cancelarCobranca || false,
      recorrencia: perm?.recorrencia || false,
      configurarBoletos: perm?.configurarBoletos || false,
      acessoRelatorios: perm?.acessoRelatorios || false,
      baixaManual: perm?.baixaManual || false,
    },
  });

  cookies().set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production",
  });

  const roleToPath: Record<Role, string> = {
    super_admin: "/super_admin/home",
    admin: "/admin/home",
    employee: "/employee/home",
  };

  const redirectPath = roleToPath[user.role as Role];

  if (!redirectPath) {
    throw new Error(`Role inválida detectada: ${user.role}`);
  }

  redirect(redirectPath);
}
