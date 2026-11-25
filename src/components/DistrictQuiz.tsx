"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { bn } from "@/lib/format";

export type QuizItem = {
  id: number;
  question: string;
  options: string[];
};

type QuizResult = {
  id: number;
  correct: boolean;
  answer: number;
  selected: number;
  correctText: string;
  explanation: string | null;
};

type QuizResponse = {
  score: number;
  total: number;
  results: QuizResult[];
};

export function DistrictQuiz({
  districtId,
  districtName,
  questions,
}: {
  districtId: number;
  districtName: string;
  questions: QuizItem[];
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<QuizResponse | null>(null);

  if (questions.length === 0) {
    return (
      <div className="quiz-card">
        <div className="quiz-head">
          <h3>{districtName} কুইজ</h3>
          <span className="quiz-progress">শীঘ্রই</span>
        </div>
        <p className="quiz-question">
          এই জেলার কুইজ এখনো তৈরি হচ্ছে। একটু পরে আবার এসো।
        </p>
      </div>
    );
  }

  const current = questions[step];
  const selected = current ? answers[current.id] : undefined;
  const answered = Object.keys(answers).length;

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/quiz/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ districtId, answers }),
      });
      const data = (await response.json()) as QuizResponse & { error?: string };
      if (!response.ok) {
        setError(data.error ?? "কুইজ জমা দেওয়া যায়নি।");
        setBusy(false);
        return;
      }
      setResult(data);
      setBusy(false);
    } catch {
      setError("নেটওয়ার্কে সমস্যা হয়েছে। আবার চেষ্টা করো।");
      setBusy(false);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setError("");
  };

  if (result) {
    const questionById = new Map(questions.map((item) => [item.id, item]));
    return (
      <div className="quiz-card">
        <div className="quiz-head">
          <h3>{districtName} কুইজ</h3>
          <span className="quiz-progress">
            {bn(result.score)} / {bn(result.total)}
          </span>
        </div>

        <div className="quiz-score">
          <b>
            {bn(result.score)} / {bn(result.total)}
          </b>
          <span>
            {result.score === result.total
              ? "দুর্দান্ত! তোমার জেলার চেনা একেবারে ঠিক।"
              : result.score >= Math.ceil(result.total / 2)
                ? "ভালো করেছ! আরেকবার খেলে পুরো নম্বর পাওয়া যাবে।"
                : "আরেকটু জানা দরকার — আবার খেলে দেখো।"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result.results.map((item) => {
            const question = questionById.get(item.id);
            return (
              <div key={item.id} className="quiz-option" data-selected={item.correct}>
                <span className="quiz-option-index">
                  {item.correct ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                </span>
                <span>
                  <span style={{ display: "block", marginBottom: 2 }}>
                    {question?.question ?? "প্রশ্ন"}
                  </span>
                  {item.correct ? (
                    <span className="quiz-correct">সঠিক উত্তর: {item.correctText}</span>
                  ) : (
                    <span className="quiz-wrong">
                      তোমার উত্তর: {question?.options[item.selected] ?? "—"} · সঠিক:{" "}
                      {item.correctText}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        <div className="quiz-footer">
          <button type="button" className="btn btn-ghost" onClick={restart}>
            <RotateCcw size={15} /> আবার খেলো
          </button>
          <span className="quiz-progress">
            <Sparkles size={12} style={{ display: "inline", verticalAlign: -2 }} />{" "}
            স্কোর শেয়ার করার জন্য শেয়ার কার্ড বানাও
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-card">
      <div className="quiz-head">
        <h3>{districtName} কুইজ</h3>
        <span className="quiz-progress">
          প্রশ্ন {bn(step + 1)} / {bn(questions.length)}
        </span>
      </div>

      <p className="quiz-question">{current.question}</p>

      <div className="quiz-options">
        {current.options.map((option, index) => (
          <button
            key={`${current.id}-${index}`}
            type="button"
            className="quiz-option"
            data-selected={selected === index}
            onClick={() =>
              setAnswers((value) => ({ ...value, [current.id]: index }))
            }
          >
            <span className="quiz-option-index">
              {String.fromCharCode(65 + index)}
            </span>
            <span>{option}</span>
          </button>
        ))}
      </div>

      {error ? (
        <p className="form-error" role="alert" style={{ marginTop: 0 }}>
          {error}
        </p>
      ) : null}

      <div className="quiz-footer">
        <span className="quiz-progress">
          {bn(answered)} / {bn(questions.length)} উত্তর দেওয়া হয়েছে
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {step > 0 ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
            >
              আগের প্রশ্ন
            </button>
          ) : null}

          {step < questions.length - 1 ? (
            <button
              type="button"
              className="btn btn-red btn-sm"
              disabled={selected === undefined}
              onClick={() => setStep((value) => value + 1)}
            >
              পরের প্রশ্ন <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-red btn-sm"
              disabled={busy || selected === undefined}
              onClick={submit}
            >
              {busy ? (
                <>
                  <Loader2 size={14} className="spin" /> দেখা হচ্ছে…
                </>
              ) : (
                <>
                  ফলাফল দেখো <Sparkles size={14} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
