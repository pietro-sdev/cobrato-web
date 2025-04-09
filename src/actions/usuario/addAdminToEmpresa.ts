"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

interface AdminInput {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  cnpj: string;
}

export async function addAdminToEmpresa(data: AdminInput) {
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { cnpj: data.cnpj },
    });

    if (!empresa) {
      return { status: 404, message: "Empresa não encontrada" };
    }

    const senhaHash = await hash(data.senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        senha: senhaHash,
        role: "admin",
        empresaId: empresa.id,
      },
    });

    revalidatePath(`/super_admin/gestao-empresas/gestao-usuarios/${data.cnpj}`);
    return { status: 200, usuario };
  } catch (error) {
    console.error("Erro ao cadastrar administrador:", error);
    return { status: 500, message: "Erro ao cadastrar administrador" };
  }
}
