import { SignJWT, type JWTPayload } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

interface UserPermissions {
  visualizarCobrancas: boolean;
  emitirBoletos: boolean;
  cancelarCobranca: boolean;
  recorrencia: boolean;
  configurarBoletos: boolean;
  acessoRelatorios: boolean;
  baixaManual: boolean;
}

type Role = "admin" | "super_admin" | "employee";

interface TokenPayload extends JWTPayload {
  id: string;
  email: string;
  nome: string;
  role: Role;
  cnpj: string;
  foto: string;
  permissions?: UserPermissions;
}

export async function generateToken(payload: TokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(JWT_SECRET);
}
