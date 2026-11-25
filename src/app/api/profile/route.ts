import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const schema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  cityId: z.coerce.number().int().positive().optional(),
  districtId: z.coerce.number().int().positive().optional(),
  yearsAbroad: z.coerce.number().int().min(0).max(70).optional(),
  profession: z.string().trim().max(80).optional().nullable(),
  bio: z.string().trim().max(320).optional().nullable(),
  photoUrl: z
    .union([z.string().trim().url(), z.literal("")])
    .optional()
    .nullable(),
  isPublic: z.boolean().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      profession: user.profession,
      bio: user.bio,
      photoUrl: user.photoUrl,
      yearsAbroad: user.yearsAbroad,
      isPublic: user.isPublic,
      city: user.city,
      district: user.district,
    },
  });
}

export async function PUT(request: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json(
      { error: "প্রোফাইল বদলাতে সাইন ইন করতে হবে।" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "অনুরোধটি পড়া যায়নি।" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "তথ্যগুলো ঠিকভাবে দাও।" },
      { status: 400 },
    );
  }

  const data = parsed.data;

  if (data.cityId || data.districtId) {
    const [city, district] = await Promise.all([
      data.cityId
        ? prisma.city.findUnique({ where: { id: data.cityId }, select: { id: true } })
        : Promise.resolve({ id: current.cityId }),
      data.districtId
        ? prisma.district.findUnique({
            where: { id: data.districtId },
            select: { id: true },
          })
        : Promise.resolve({ id: current.districtId }),
    ]);
    if (!city || !district) {
      return NextResponse.json(
        { error: "শহর বা জেলার তথ্য পাওয়া যায়নি।" },
        { status: 400 },
      );
    }
  }

  try {
    const user = await prisma.user.update({
      where: { id: current.id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.cityId !== undefined ? { cityId: data.cityId } : {}),
        ...(data.districtId !== undefined ? { districtId: data.districtId } : {}),
        ...(data.yearsAbroad !== undefined ? { yearsAbroad: data.yearsAbroad } : {}),
        ...(data.profession !== undefined
          ? { profession: data.profession || null }
          : {}),
        ...(data.bio !== undefined ? { bio: data.bio || null } : {}),
        ...(data.photoUrl !== undefined ? { photoUrl: data.photoUrl || null } : {}),
        ...(data.isPublic !== undefined ? { isPublic: data.isPublic } : {}),
      },
      include: { city: true, district: true },
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        city: user.city,
        district: user.district,
        yearsAbroad: user.yearsAbroad,
        profession: user.profession,
        bio: user.bio,
        isPublic: user.isPublic,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    console.error("profile update error", error);
    return NextResponse.json(
      { error: "প্রোফাইল সংরক্ষণ করা যায়নি। আবার চেষ্টা করো।" },
      { status: 500 },
    );
  }
}
