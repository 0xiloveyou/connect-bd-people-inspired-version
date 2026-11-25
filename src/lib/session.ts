import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const id = await verifySessionToken(token);
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id },
    include: { city: true, district: true },
  });
}

export type SessionUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
