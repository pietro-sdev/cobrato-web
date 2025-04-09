import { parseJwt } from "@/lib/auth/parse-jwt";
import { cookies } from "next/headers";

export function getUserFromToken(): {
  id: string;
  email: string;
  role: "admin" | "super-admin" | "employee";
} | null {
  if (typeof window === "undefined") return null;

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const payload = parseJwt(token);
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
