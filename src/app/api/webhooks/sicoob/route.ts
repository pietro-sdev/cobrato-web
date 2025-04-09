import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  console.log("📩 Webhook Sicoob recebido:", payload);

  // TODO: Atualizar status da cobrança com base no payload.nossoNumero ou identificador do boleto

  return NextResponse.json({ received: true });
}