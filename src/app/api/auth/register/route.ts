import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

const avatarPalette = [
  "#0b6e4f",
  "#0f766e",
  "#155e75",
  "#9f1239",
  "#b45309",
  "#1d4ed8",
  "#7c3aed",
  "#4d7c0f",
];

function colorFor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 997;
  return avatarPalette[hash % avatarPalette.length];
}

const schema = z.object({
  name: z.string().trim().min(2, "নাম অন্তত ২ অক্ষরের হতে হবে।").max(80),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("সঠিক ইমেইল দাও।")
    .max(160),
  password: z
    .string()
    .min(6, "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।")
    .max(120),
  cityId: z.coerce.number().int().positive("প্রবাসের শহর বেছে নাও।"),
  districtId: z.coerce.number().int().positive("বাড়ির জেলা বেছে নাও।"),
  yearsAbroad: z.coerce.number().int().min(0).max(70).default(0),
  profession: z.string().trim().max(80).optional().nullable(),
  isPublic: z.boolean().optional().default(true),
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
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "তথ্যগুলো ঠিকভাবে দাও।" },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "এই ইমেইলে আগেই একটি অ্যাকাউন্ট আছে। সাইন ইন করো।" },
        { status: 409 },
      );
    }

    const [city, district] = await Promise.all([
      prisma.city.findUnique({ where: { id: data.cityId }, select: { id: true } }),
      prisma.district.findUnique({
        where: { id: data.districtId },
        select: { id: true },
      }),
    ]);
    if (!city || !district) {
      return NextResponse.json(
        { error: "শহর বা জেলার তথ্য পাওয়া যায়নি। আবার বেছে নাও।" },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        avatarColor: colorFor(data.name),
        profession: data.profession || null,
        cityId: data.cityId,
        districtId: data.districtId,
        yearsAbroad: data.yearsAbroad,
        isPublic: data.isPublic,
      },
      select: { id: true, name: true },
    });

    const token = await createSessionToken(user.id);
    const response = NextResponse.json({
      ok: true,
      user,
      redirect: "/profile",
    });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return response;
  } catch (error) {
    console.error("register error", error);
    return NextResponse.json(
      { error: "অ্যাকাউন্ট তৈরি করা যায়নি। একটু পরে আবার চেষ্টা করো।" },
      { status: 500 },
    );
  }
}
