import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  banco: z.enum(["inter", "sicoob", "asaas"]),
  empresaCnpj: z.string(),
  configuracoes: z.any(),
});

/**
 * POST /api/bancos
 *
 * Exemplo de body (JSON):
 * {
 *   "banco": "inter",
 *   "configuracoes": { ... },
 *   "empresaCnpj": "12345678000199"
 * }
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos." },
        { status: 400 }
      );
    }

    const { banco, empresaCnpj, configuracoes } = parsed.data;

    const empresa = await prisma.empresa.findUnique({
      where: { cnpj: empresaCnpj },
    });
    if (!empresa) {
      return NextResponse.json(
        { success: false, error: "Empresa não encontrada." },
        { status: 404 }
      );
    }

    const existente = await prisma.integracaoBancaria.findFirst({
      where: {
        empresaId: empresa.id,
        banco,
      },
    });

    if (existente) {
      await prisma.integracaoBancaria.update({
        where: { id: existente.id },
        data: {
          configuracoes,
        },
      });
    } else {
      await prisma.integracaoBancaria.create({
        data: {
          empresaId: empresa.id,
          banco,
          configuracoes,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar configuração bancária:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno ao salvar configuração." },
      { status: 500 }
    );
  }
}
