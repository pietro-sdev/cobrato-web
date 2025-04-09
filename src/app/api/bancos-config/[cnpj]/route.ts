import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET(
  request: Request,
  { params }: { params: { cnpj: string } }
) {
  try {
    const { cnpj } = params;

    const empresa = await prisma.empresa.findUnique({
      where: { cnpj },
      select: {
        id: true,
        bancos: true,
      },
    });

    if (!empresa) {
      return NextResponse.json(
        { success: false, error: "Empresa não encontrada." },
        { status: 404 }
      );
    }

    const configs: Record<string, any> = {};
    for (const b of empresa.bancos) {
      configs[b.banco] = b.configuracoes; 
    }

    return NextResponse.json({
      success: true,
      configs, 
    });
  } catch (error) {
    console.error("Erro ao buscar configs bancárias:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
