import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

const STATE_COOKIE = "probash_oauth_state";
const avatarPalette = ["#0b6e4f", "#0f766e", "#155e75", "#9f1239", "#b45309", "#1d4ed8"];

function colorFor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 997;
  return avatarPalette[hash % avatarPalette.length];
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${STATE_COOKIE}=`))
    ?.split("=")[1];

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/join?error=google-unavailable", url.origin));
  }
  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(new URL("/join?error=oauth-state", url.origin));
  }

  try {
    const redirectUri = new URL("/api/auth/google/callback", url.origin).toString();
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Google token exchange failed");
    }
    const tokens = (await tokenResponse.json()) as { access_token?: string };
    if (!tokens.access_token) throw new Error("No access token");

    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
        cache: "no-store",
      },
    );
    if (!profileResponse.ok) throw new Error("Google profile failed");

    const profile = (await profileResponse.json()) as {
      sub: string;
      email?: string;
      name?: string;
      picture?: string;
    };

    if (!profile.email) {
      return NextResponse.redirect(new URL("/join?error=oauth-email", url.origin));
    }

    const email = profile.email.toLowerCase();
    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId: profile.sub }, { email }] },
      select: { id: true, cityId: true, googleId: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: profile.name ?? email.split("@")[0],
          email,
          googleId: profile.sub,
          photoUrl: profile.picture ?? null,
          passwordHash: null,
          avatarColor: colorFor(profile.name ?? email),
          isPublic: true,
        },
        select: { id: true, cityId: true, googleId: true },
      });
    } else if (!user.googleId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { googleId: profile.sub, photoUrl: profile.picture ?? null },
      });
    }

    const token = await createSessionToken(user.id);
    const destination = user.cityId ? "/profile" : "/onboarding";
    const response = NextResponse.redirect(new URL(destination, url.origin));
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    response.cookies.set(STATE_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    console.error("google callback error", error);
    return NextResponse.redirect(new URL("/join?error=oauth-failed", url.origin));
  }
}
