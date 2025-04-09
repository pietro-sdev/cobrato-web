import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  console.log("📩 Webhook Inter recebido:", payload);

  // TODO: Atualizar status da cobrança com base no payload.documentNumber ou transactionId

  return NextResponse.json({ received: true });
}