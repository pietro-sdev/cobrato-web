"use server";

import { prisma } from "@/lib/prisma";

export async function getEmpresaByCnpj(cnpj: string) {
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { cnpj },
      include: { endereco: true },
    });

    if (!empresa) return null;

    return {
      name: empresa.nome,
      cnpj: empresa.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"),
      phone: empresa.telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3"),
      email: empresa.email,
      registrationDate: new Date(empresa.createdAt).toLocaleDateString("pt-BR"),
      responsavel: empresa.responsavel,
      segment: empresa.segmento,
      status: empresa.status ? "Ativo" : "Inativo",
      cep: empresa.endereco?.cep ?? "",
      street: empresa.endereco?.rua ?? "",
      number: empresa.endereco?.numero ?? "",
      complement: empresa.endereco?.complemento ?? "",
      neighborhood: empresa.endereco?.bairro ?? "",
      city: empresa.endereco?.cidade ?? "",
      state: empresa.endereco?.estado ?? "",
    };
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    return null;
  }
}
