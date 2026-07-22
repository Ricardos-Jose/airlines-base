import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // 1. Buscar usuário pelo e-mail
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  // 2. Comparar a senha fornecida com o hash armazenado
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  // 3. Gerar token JWT (expira em 7 dias, por exemplo)
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // 4. Criar resposta e definir cookie HTTP‑only com o token
  const response = NextResponse.json(
    { message: "Login realizado com sucesso" },
    { status: 200 }
  );

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  });

  return response;
}