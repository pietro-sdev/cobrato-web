"use server"; // Indica que este arquivo é executado no server

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  banco: z.enum(["inter", "sicoob", "asaas"]),
  empresaCnpj: z.string(),
  configuracoes: z.any(),
});

export async function salvarConfiguracaoBanco(data: unknown) {
  console.log("📥 Dados recebidos para salvar integração bancária:", data);

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    console.error("❌ Erro na validação:", parsed.error.format());
    return { success: false, error: "Dados inválidos." };
  }

  const { banco, empresaCnpj, configuracoes } = parsed.data;

  try {
    const empresa = await prisma.empresa.findUnique({
      where: { cnpj: empresaCnpj },
    });

    if (!empresa) {
      console.error("❌ Empresa não encontrada para o CNPJ:", empresaCnpj);
      return { success: false, error: "Empresa não encontrada." };
    }

    const empresaId = empresa.id;
    const existente = await prisma.integracaoBancaria.findFirst({
      where: { empresaId, banco },
    });

    if (existente) {
      console.log("🔁 Atualizando integração existente");
      await prisma.integracaoBancaria.update({
        where: { id: existente.id },
        data: {
          configuracoes,
          ativa: true,
        },
      });
    } else {
      console.log("🆕 Criando nova integração bancária");
      await prisma.integracaoBancaria.create({
        data: {
          banco,
          configuracoes,
          empresaId, 
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Erro ao salvar integração bancária:", error);
    return { success: false, error: "Erro ao salvar integração." };
  }
}
