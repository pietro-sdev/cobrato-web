import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  console.log("📩 Webhook Asaas recebido:", payload);

  // TODO: Atualizar status da cobrança no banco baseado no payload.id ou payload.invoiceNumber

  return NextResponse.json({ received: true });
}