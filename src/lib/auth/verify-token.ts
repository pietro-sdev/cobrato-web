import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

interface TokenPayload {
  id: string;
  role: "super_admin" | "admin" | "employee";
  email: string;
  exp: number;
}

export async function verifyToken(): Promise<TokenPayload | null> {
  const token = cookies().get("token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify<TokenPayload>(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}
