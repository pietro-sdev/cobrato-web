"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateOAuthTokenInter, criarBoletoInter } from "@/lib/bancoInter";

/**
 * Validamos alguns campos do front:
 * - cliente (nome do cliente)
 * - descricao (opcional)
 * - valor (string "R$ 100,00")
 * - vencimento (ex: "dd/MM/yyyy")
 * - empresaCnpj
 */
const schema = z.object({
  cliente: z.string(),
  descricao: z.string().optional(),
  valor: z.string(),
  vencimento: z.string(),
  empresaCnpj: z.string(),
});

/**
 * Server Action para emitir cobrança no Inter.
 * 1) Busca config da empresa (pelo cnpj).
 * 2) Gera token OAuth (c/ mTLS).
 * 3) Chama `criarBoletoInter`.
 */
export async function emitirCobrancaInter(formData: unknown) {
  // 1) Validar
  const parsed = schema.safeParse(formData);
  if (!parsed.success) {
    console.error("Erros de validação:", parsed.error.format());
    return { success: false, error: "Dados inválidos para emissão." };
  }

  const { cliente, descricao, valor, vencimento, empresaCnpj } = parsed.data;

  try {
    // 2) Buscar empresa
    const empresa = await prisma.empresa.findUnique({
      where: { cnpj: empresaCnpj },
    });
    if (!empresa) {
      return { success: false, error: "Empresa não encontrada." };
    }

    // 3) Buscar integração do Banco Inter
    const integracao = await prisma.integracaoBancaria.findFirst({
      where: {
        empresaId: empresa.id,
        banco: "inter",
      },
    });
    if (!integracao) {
      return {
        success: false,
        error: "Nenhuma integração do Banco Inter encontrada para esta empresa.",
      };
    }

    // 4) Extrair credenciais e gerar token
    const {
      clientId,
      clientSecret,
      certificadoBase64,
      senhaCertificado,
      ambiente,
    } = integracao.configuracoes as any;

    const tokenResponse = await generateOAuthTokenInter({
      clientId,
      clientSecret,
      certificadoBase64,
      senhaCertificado,
      ambiente,
    });
    if (!tokenResponse.success || !tokenResponse.accessToken) {
      return {
        success: false,
        error: tokenResponse.error || "Não foi possível obter accessToken.",
      };
    }

    const accessToken: string = tokenResponse.accessToken;

    // 5) Converter valor "R$ 100,00" -> 100.0
    const numericValue = parseFloat(
      valor.replace("R$", "").replace(".", "").replace(",", ".").trim()
    );

    // 6) Converter data "dd/MM/yyyy" -> "yyyy-MM-dd"
    const [dia, mes, ano] = vencimento.split("/");
    const dataVencimentoISO =
      vencimento.includes("/") && dia && mes && ano
        ? `${ano}-${mes}-${dia}`
        : vencimento; // se já vier no formato ISO

    // 7) Emitir Boleto
    const boletoResponse = await criarBoletoInter({
      accessToken,
      ambiente,
      valor: numericValue,
      vencimento: dataVencimentoISO,
      descricao: descricao || "",
      nomeCliente: cliente,
      certificadoBase64,
      senhaCertificado,
    });

    if (!boletoResponse.success) {
      return { success: false, error: boletoResponse.error };
    }

    // Se sucesso, retornamos dados
    return { success: true, ...boletoResponse.data };
  } catch (error) {
    console.error("Erro ao emitir cobrança Inter:", error);
    return { success: false, error: "Erro ao emitir cobrança no servidor." };
  }
}
