import { type NextRequest, NextResponse, type MiddlewareConfig } from "next/server";

const PUBLIC_ROUTES = ["/login", "/esqueci-a-senha"];

type Role = "super_admin" | "admin" | "employee";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  const redirectToLogin = () => {
    const loginURL = request.nextUrl.clone();
    loginURL.pathname = "/login";
    return NextResponse.redirect(loginURL);
  };

  // 1. Libera rotas públicas
  if (PUBLIC_ROUTES.includes(path)) {
    return NextResponse.next();
  }

  // 2. Se não tem token, bloqueia
  if (!token) return redirectToLogin();

  try {
    // 3. Decodifica o token
    const payloadBase64 = token.split(".")[1];
    const jsonPayload = JSON.parse(atob(payloadBase64));
    const userRole = jsonPayload.role as Role;
    const currentTime = Math.floor(Date.now() / 1000);

    // 4. Expirado? apaga o token
    if (jsonPayload.exp < currentTime) {
      const res = redirectToLogin();
      res.cookies.delete("token");
      return res;
    }

    // 5. Proteção por role
    const routePrefix = path.split("/")[1];

    const roleToRoutePrefix: Record<Role, string> = {
      super_admin: "super_admin",
      admin: "admin",
      employee: "employee",
    };

    if (routePrefix !== roleToRoutePrefix[userRole]) {
      const url = request.nextUrl.clone();
      url.pathname = `/${roleToRoutePrefix[userRole]}/home`;
      return NextResponse.redirect(url);
    }

    // 6. OK
    return NextResponse.next();
  } catch {
    return redirectToLogin();
  }
}

export const config: MiddlewareConfig = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp|.*\\.gif|.*\\.css|.*\\.js|.*\\.ico|.*\\.ttf|.*\\.woff|.*\\.woff2|.*\\.mp4|.*\\.mp3).*)',
  ],
};
