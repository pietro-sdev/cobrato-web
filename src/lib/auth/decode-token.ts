import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  email: string;
  nome: string;
  role: "super-admin" | "admin" | "employee";
  exp: number;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}
