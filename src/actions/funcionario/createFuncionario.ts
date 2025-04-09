"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface CreateFuncionarioInput {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  empresaCnpj: string;
  permissoes: string[];
}

export async function createFuncionario(input: CreateFuncionarioInput) {
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { cnpj: input.empresaCnpj },
    });

    if (!empresa) {
      return { success: false, error: "Empresa não encontrada." };
    }

    const hashedPassword = await bcrypt.hash(input.senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: input.nome,
        email: input.email,
        telefone: input.telefone,
        senha: hashedPassword,
        role: "employee",
        empresaId: empresa.id,
        permissoes: {
          create: {
            visualizarCobrancas: input.permissoes.includes("view_charges"),
            emitirBoletos: input.permissoes.includes("create_charges"),
            recorrencia: input.permissoes.includes("recurrence"),
            baixaManual: input.permissoes.includes("manual_payment"),
            cancelarCobranca: input.permissoes.includes("cancel_charges"),
            acessoRelatorios: input.permissoes.includes("reports"),
            configurarBoletos: input.permissoes.includes("config_boleto"),
          },
        },
      },
    });

    return { success: true, usuario: novoUsuario };
  } catch (error) {
    console.error("Erro ao criar funcionário:", error);
    return { success: false, error: "Erro interno ao criar funcionário." };
  }
}
