import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET() {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id as string;

    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        empresa: true,
        permissoes: true, 
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const perm = user.permissoes.length ? user.permissoes[0] : null;

    return NextResponse.json({
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
      cnpj: user.empresa?.cnpj || "",
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
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
