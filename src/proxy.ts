import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Rotas públicas – não exigem token
  const publicPaths = ["/login", "/register"];
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Se não houver token, redireciona para /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verifica se o token é válido
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    // Token inválido ou expirado
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/page.tsx/:path*", "/profile/:path*"], // ajuste para suas rotas privadas
};
