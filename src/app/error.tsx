"use client";

import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found-inner">
          <span className="not-found-code">কিছু একটা ভুল হয়েছে</span>
          <h1>
            মানচিত্রটা
            <br />
            এক মুহূর্তের জন্য থেমে গেছে
          </h1>
          <p>
            সার্ভারে একটা অপ্রত্যাশিত সমস্যা হয়েছে। আবার চেষ্টা করো — বেশিরভাগ
            সময় একবার রিফ্রেশ করলেই সব ঠিক হয়ে যায়।
          </p>
          <div className="btn-row">
            <button type="button" className="btn btn-light" onClick={reset}>
              <RotateCcw size={16} /> আবার চেষ্টা করো
            </button>
            <Link href="/" className="btn btn-ghost">
              <Home size={16} /> হোমে ফিরে যাও
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
