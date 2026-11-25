import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("সঠিক ইমেইল দাও।"),
  password: z.string().min(1, "পাসওয়ার্ড দাও।").max(120),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "অনুরোধটি পড়া যায়নি।" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "তথ্যগুলো দাও।" },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, name: true, passwordHash: true, cityId: true },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "ইমেইল বা পাসওয়ার্ড ঠিক নেই।" },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "ইমেইল বা পাসওয়ার্ড ঠিক নেই।" },
        { status: 401 },
      );
    }

    const token = await createSessionToken(user.id);
    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name },
      redirect: user.cityId ? "/profile" : "/onboarding",
    });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return response;
  } catch (error) {
    console.error("login error", error);
    return NextResponse.json(
      { error: "সাইন ইন করা যায়নি। একটু পরে চেষ্টা করো।" },
      { status: 500 },
    );
  }
}
