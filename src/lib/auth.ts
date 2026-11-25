import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "probash_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "probash-dev-secret-change-me-please-32-chars",
);

export async function createSessionToken(userId: number): Promise<string> {
  return new SignJWT({ sub: String(userId) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const id = Number(payload.sub);
    return Number.isFinite(id) ? id : null;
  } catch {
    return null;
  }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const isLocalSite = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(siteUrl);

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  // Secure cookies are required in production. Local production previews over
  // plain HTTP keep working because the default site URL is localhost.
  secure: process.env.NODE_ENV === "production" && !isLocalSite,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
