"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface EmpresaInput {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  responsavel: string;
  segment: string;
  status: "ativo" | "inativo";
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export async function addEmpresa(data: EmpresaInput) {
  try {
    const empresa = await prisma.empresa.create({
      data: {
        nome: data.name,
        cnpj: data.cnpj,
        email: data.email,
        telefone: data.phone,
        responsavel: data.responsavel,
        segmento: data.segment,
        status: data.status === "ativo",
        endereco: {
          create: {
            cep: data.cep,
            rua: data.street,
            numero: data.number,
            complemento: data.complement ?? undefined,
            bairro: data.neighborhood,
            cidade: data.city,
            estado: data.state,
          },
        },
      },
    });

    revalidatePath("/super_admin/gestao-empresas");
    return { status: 200, empresa };
  } catch (error) {
    console.error("Erro ao cadastrar empresa:", error);
    return { status: 500, message: "Erro ao cadastrar empresa" };
  }
}
