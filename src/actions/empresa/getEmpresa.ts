"use server";

import { prisma } from "@/lib/prisma";

export async function getEmpresas() {
  try {
    const empresas = await prisma.empresa.findMany({
      select: {
        nome: true,
        cnpj: true,
        telefone: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return empresas.map((empresa) => ({
      name: empresa.nome,
      cnpj: empresa.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"),
      phone: empresa.telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3"),
      status: empresa.status ? "Ativo" : "Inativo",
      registrationDate: new Date(empresa.createdAt).toLocaleDateString("pt-BR"),
    }));
  } catch (error) {
    console.error("Erro ao buscar empresas cadastradas:", error);
    return [];
  }
}
