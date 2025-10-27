import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/backend/lib/prisma";

interface TokenPayload {
  userId: number;
  role: string;
  iat?: number;
  exp?: number;
}
export async function getCurrentUser() {
  // Do NOT await cookies()
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("refreshToken");
  const token = tokenCookie?.value;
  console.log("Token", token);
  if (!token) return null;

  try {
    const payload = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    return user;
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return null;
  }
}
