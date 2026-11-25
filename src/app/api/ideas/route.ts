import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().max(60).optional().nullable(),
  email: z
    .union([z.string().trim().email("সঠিক ইমেইল দাও।"), z.literal("")])
    .optional()
    .nullable(),
  message: z
    .string()
    .trim()
    .min(5, "একটু বিস্তারিত লিখো (অন্তত ৫ অক্ষর)।")
    .max(1500, "আইডিয়াটি একটু ছোট করে লিখো।"),
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
      { error: parsed.error.issues[0]?.message ?? "তথ্যগুলো ঠিকভাবে দাও।" },
      { status: 400 },
    );
  }

  const { name, email, message } = parsed.data;
  try {
    await prisma.idea.create({
      data: {
        name: name || null,
        email: email || null,
        message,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("idea error", error);
    return NextResponse.json(
      { error: "আইডিয়া পাঠানো যায়নি। আবার চেষ্টা করো।" },
      { status: 500 },
    );
  }
}
