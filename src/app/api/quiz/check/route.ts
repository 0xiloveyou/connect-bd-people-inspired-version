import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  districtId: z.coerce.number().int().positive(),
  answers: z.record(z.string(), z.number().int().min(0).max(3)),
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
      { error: "কুইজের উত্তরগুলো ঠিকভাবে পাঠাও।" },
      { status: 400 },
    );
  }

  const ids = Object.keys(parsed.data.answers)
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id));

  const questions = await prisma.quizQuestion.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      answer: true,
      explanation: true,
      option0: true,
      option1: true,
      option2: true,
      option3: true,
    },
  });

  let score = 0;
  const results = questions.map((question) => {
    const selected = parsed.data.answers[String(question.id)];
    const correct = selected === question.answer;
    if (correct) score += 1;
    return {
      id: question.id,
      correct,
      answer: question.answer,
      selected,
      correctText: [
        question.option0,
        question.option1,
        question.option2,
        question.option3,
      ][question.answer],
      explanation: question.explanation,
    };
  });

  return NextResponse.json({
    score,
    total: results.length,
    results,
  });
}
