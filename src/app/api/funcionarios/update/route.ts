import { NextResponse } from "next/server";
import { updateFuncionarioById } from "@/actions/funcionario/updateFuncionarioById";

export async function POST(req: Request) {
  const data = await req.json();
  const resultado = await updateFuncionarioById(data);
  return NextResponse.json(resultado);
}
