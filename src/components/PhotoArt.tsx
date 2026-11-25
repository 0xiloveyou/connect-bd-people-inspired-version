type ArtKind =
  | "beach"
  | "tea"
  | "mangrove"
  | "hills"
  | "river"
  | "mango"
  | "city"
  | "haor";

export function PhotoArt({
  art,
  uid,
}: {
  art: string;
  uid: string;
}) {
  const kind = (art || "river") as ArtKind;
  const id = (name: string) => `${name}-${uid}`;

  const common = {
    viewBox: "0 0 400 500",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true as const,
    focusable: "false" as const,
  };

  if (kind === "beach") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2e2340" />
            <stop offset="45%" stopColor="#a94b4d" />
            <stop offset="72%" stopColor="#f4a261" />
            <stop offset="100%" stopColor="#ffd99a" />
          </linearGradient>
          <linearGradient id={id("sea")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d98b5d" />
            <stop offset="40%" stopColor="#2b6a60" />
            <stop offset="100%" stopColor="#0b2b22" />
          </linearGradient>
          <linearGradient id={id("sand")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e6c79c" />
            <stop offset="100%" stopColor="#b58c5c" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#${id("sky")})`} />
        <circle cx="250" cy="232" r="52" fill="#ffe4ae" opacity=".9" />
        <rect y="268" width="400" height="132" fill={`url(#${id("sea")})`} />
        <g fill="none" stroke="#ffe4ae" strokeWidth="2" opacity=".45">
          <path d="M0 310 q30 -8 60 0 t60 0 t60 0 t60 0 t60 0 t60 0" />
          <path d="M0 336 q30 8 60 0 t60 0 t60 0 t60 0 t60 0 t60 0" />
          <path d="M0 364 q30 -8 60 0 t60 0 t60 0 t60 0 t60 0 t60 0" />
        </g>
        <path d="M0 402 q90 -26 200 2 t200 -8 v104 H0Z" fill={`url(#${id("sand")})`} />
        <g fill="#132d24">
          <path d="M78 380 q6 -78 12 0 q-6 -12 -12 0Z" />
          <path d="M84 306 q-34 -18 -44 -46 q34 4 44 30Z" />
          <path d="M84 310 q36 -22 54 -54 q2 38 -30 56Z" />
          <path d="M84 314 q-38 2 -60 -16 q28 26 60 18Z" />
        </g>
        <g fill="#0b2b22" opacity=".85">
          <path d="M284 360 q20 -12 40 0 l-6 5 q-14 -8 -28 0Z" />
          <path d="M304 340 v20" stroke="#0b2b22" strokeWidth="2" />
        </g>
        <g fill="#12251f" opacity=".7">
          <path d="M40 120 q10 -7 20 0 q-10 -3 -20 0Z" />
          <path d="M64 104 q9 -6 18 0 q-9 -3 -18 0Z" />
        </g>
      </svg>
    );
  }

  if (kind === "tea") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d6ead9" />
            <stop offset="55%" stopColor="#9bc7a7" />
            <stop offset="100%" stopColor="#3c7a58" />
          </linearGradient>
          <linearGradient id={id("hill")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c7452" />
            <stop offset="100%" stopColor="#0b3c2a" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#${id("sky")})`} />
        <circle cx="310" cy="110" r="44" fill="#fff6d8" opacity=".8" />
        <path d="M0 248 q70 -60 142 -2 q66 -58 130 0 q62 -70 128 4 v250 H0Z" fill="#4f8c66" />
        <path d="M0 300 q80 -54 160 0 q80 -56 160 0 q46 -22 80 0 v200 H0Z" fill={`url(#${id("hill")})`} />
        <g fill="#1d5c40">
          <path d="M0 356 q100 -28 200 6 q100 32 200 -4 v142 H0Z" />
          <path d="M0 398 q100 -24 200 6 q100 30 200 -2 v98 H0Z" />
        </g>
        <g fill="none" stroke="#2f7a56" strokeWidth="3" opacity=".7">
          <path d="M-20 340 q110 -34 220 6 q110 36 220 -8" />
          <path d="M-20 374 q110 -32 220 8 q110 34 220 -10" />
          <path d="M-20 410 q110 -28 220 10 q110 30 220 -12" />
          <path d="M-20 446 q110 -26 220 12 q110 28 220 -14" />
        </g>
        <g fill="#0b3c2a" opacity=".75">
          <ellipse cx="86" cy="372" rx="16" ry="9" />
          <ellipse cx="126" cy="384" rx="12" ry="7" />
          <ellipse cx="296" cy="366" rx="15" ry="8" />
          <ellipse cx="332" cy="382" rx="11" ry="6" />
        </g>
        <g>
          <path d="M188 418 v-38" stroke="#f0e0bd" strokeWidth="2" />
          <path d="M168 418 q20 -48 40 0Z" fill="#e9d7b3" />
        </g>
      </svg>
    );
  }

  if (kind === "mangrove") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a2f2b" />
            <stop offset="55%" stopColor="#1d5f52" />
            <stop offset="100%" stopColor="#d9b77a" />
          </linearGradient>
          <linearGradient id={id("water")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2b6b5b" />
            <stop offset="100%" stopColor="#051f18" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#${id("sky")})`} />
        <circle cx="110" cy="156" r="34" fill="#ffe8bb" opacity=".85" />
        <rect y="278" width="400" height="222" fill={`url(#${id("water")})`} />
        <g stroke="#03150f" fill="#03150f">
          <g>
            <path d="M60 320 l-18 -8 M60 320 l-12 22 M60 320 l16 24 M60 320 l20 -14 M60 320 v34" strokeWidth="3" />
            <circle cx="60" cy="286" r="26" />
            <circle cx="34" cy="304" r="18" />
            <circle cx="88" cy="300" r="20" />
          </g>
          <g>
            <path d="M188 336 l-16 -6 M188 336 l-10 20 M188 336 l14 22 M188 336 l18 -12" strokeWidth="2.5" />
            <circle cx="188" cy="308" r="21" />
            <circle cx="168" cy="322" r="14" />
            <circle cx="210" cy="320" r="16" />
          </g>
          <g>
            <path d="M318 330 l-20 -8 M318 330 l-14 26 M318 330 l18 24 M318 330 l24 -14 M318 330 v38" strokeWidth="3" />
            <circle cx="318" cy="292" r="30" />
            <circle cx="286" cy="312" r="20" />
            <circle cx="350" cy="308" r="22" />
          </g>
        </g>
        <g fill="none" stroke="#d8bb85" strokeWidth="1.4" opacity=".3">
          <path d="M0 312 q40 8 80 0 t80 0 t80 0 t80 0 t80 0" />
          <path d="M0 354 q40 -8 80 0 t80 0 t80 0 t80 0 t80 0" />
          <path d="M0 398 q40 8 80 0 t80 0 t80 0 t80 0 t80 0" />
        </g>
        <g fill="#06231a" opacity=".85">
          <path d="M62 350 q26 -10 52 0 l-6 6 q-20 -6 -40 0Z" />
          <path d="M88 320 v30" stroke="#06231a" strokeWidth="2" />
          <path d="M88 320 l24 -12 l-4 8Z" />
        </g>
      </svg>
    );
  }

  if (kind === "hills") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dcece0" />
            <stop offset="58%" stopColor="#9dc7b2" />
            <stop offset="100%" stopColor="#5d9a7c" />
          </linearGradient>
          <linearGradient id={id("lake")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4e8f78" />
            <stop offset="100%" stopColor="#0c3125" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#${id("sky")})`} />
        <circle cx="304" cy="104" r="38" fill="#fff6d8" opacity=".8" />
        <path d="M0 250 L92 108 L184 248 L264 138 L360 256 L400 220 V330 H0Z" fill="#3f7f64" />
        <path d="M0 292 L88 186 L176 296 L280 204 L400 300 V360 H0Z" fill="#1f5843" />
        <rect y="330" width="400" height="170" fill={`url(#${id("lake")})`} />
        <path d="M0 334 q90 -18 190 4 q120 24 210 -2 v22 q-100 22 -210 0 q-100 -18 -190 2Z" fill="#a6d3bb" opacity=".35" />
        <g fill="#08271d">
          <path d="M46 354 q32 -12 64 0 l-8 7 q-24 -7 -48 0Z" />
          <path d="M96 336 v26" stroke="#08271d" strokeWidth="2" />
          <path d="M96 336 l28 -12 l-4 8Z" />
        </g>
        <g fill="none" stroke="#d7ede1" strokeWidth="1.6" opacity=".4">
          <path d="M0 392 q50 8 100 0 t100 0 t100 0 t100 0" />
          <path d="M0 424 q50 -8 100 0 t100 0 t100 0 t100 0" />
        </g>
        <g fill="#f4fbf7" opacity=".6">
          <ellipse cx="120" cy="120" rx="50" ry="12" />
          <ellipse cx="78" cy="134" rx="34" ry="8" />
        </g>
      </svg>
    );
  }

  if (kind === "mango") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d7a1" />
            <stop offset="55%" stopColor="#e9a95e" />
            <stop offset="100%" stopColor="#7a8a4b" />
          </linearGradient>
          <linearGradient id={id("field")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7d944d" />
            <stop offset="100%" stopColor="#3a5a2c" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#${id("sky")})`} />
        <circle cx="112" cy="122" r="46" fill="#fff3c9" opacity=".75" />
        <rect y="350" width="400" height="150" fill={`url(#${id("field")})`} />
        <path d="M0 362 q100 -18 200 2 q100 20 200 -6 v142 H0Z" fill="#4c6b3a" />
        <g fill="#2e4624">
          <path d="M200 402 v-116" stroke="#3c2b1b" strokeWidth="10" />
          <path d="M200 322 q-52 -18 -80 -66" stroke="#3c2b1b" strokeWidth="7" fill="none" />
          <path d="M200 330 q54 -20 84 -70" stroke="#3c2b1b" strokeWidth="7" fill="none" />
          <circle cx="150" cy="252" r="56" />
          <circle cx="238" cy="238" r="62" />
          <circle cx="196" cy="286" r="48" />
          <circle cx="104" cy="282" r="38" />
          <circle cx="294" cy="270" r="40" />
        </g>
        <g fill="#f5b845">
          <ellipse cx="150" cy="288" rx="10" ry="13" />
          <ellipse cx="230" cy="280" rx="11" ry="14" />
          <ellipse cx="196" cy="324" rx="9" ry="12" />
          <ellipse cx="284" cy="300" rx="9" ry="12" />
          <ellipse cx="112" cy="310" rx="8" ry="11" />
        </g>
        <g fill="#2f4c2a">
          <path d="M58 404 q8 -54 16 0Z" />
          <path d="M66 350 q-24 -14 -34 -36 q26 2 34 20Z" />
          <path d="M66 354 q26 -16 38 -42 q0 30 -24 46Z" />
        </g>
        <g fill="#e8d6a8">
          <path d="M318 410 v-38 h48 v38Z" />
          <path d="M310 374 h64 l-32 -26Z" />
          <rect x="334" y="386" width="12" height="24" fill="#5a3d25" />
        </g>
      </svg>
    );
  }

  if (kind === "city") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#152c3a" />
            <stop offset="52%" stopColor="#57475a" />
            <stop offset="100%" stopColor="#c97d52" />
          </linearGradient>
          <linearGradient id={id("ground")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2b2a30" />
            <stop offset="100%" stopColor="#0a1115" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#${id("sky")})`} />
        <circle cx="302" cy="142" r="34" fill="#ffd5a1" opacity=".9" />
        <g fill="#1a242d">
          <rect x="20" y="250" width="70" height="190" />
          <rect x="96" y="210" width="52" height="230" />
          <rect x="154" y="276" width="66" height="164" />
          <rect x="226" y="232" width="52" height="208" />
          <rect x="284" y="266" width="44" height="174" />
          <rect x="334" y="218" width="46" height="222" />
        </g>
        <g fill="#f3c98c" opacity=".65">
          <rect x="34" y="270" width="8" height="12" />
          <rect x="52" y="270" width="8" height="12" />
          <rect x="70" y="294" width="8" height="12" />
          <rect x="34" y="316" width="8" height="12" />
          <rect x="108" y="234" width="8" height="12" />
          <rect x="126" y="234" width="8" height="12" />
          <rect x="108" y="262" width="8" height="12" />
          <rect x="126" y="290" width="8" height="12" />
          <rect x="168" y="298" width="8" height="12" />
          <rect x="190" y="298" width="8" height="12" />
          <rect x="168" y="328" width="8" height="12" />
          <rect x="238" y="256" width="8" height="12" />
          <rect x="258" y="256" width="8" height="12" />
          <rect x="238" y="288" width="8" height="12" />
          <rect x="346" y="242" width="8" height="12" />
          <rect x="364" y="242" width="8" height="12" />
          <rect x="346" y="274" width="8" height="12" />
        </g>
        <path d="M116 210 v-38" stroke="#1a242d" strokeWidth="4" />
        <path d="M106 176 h20" stroke="#e7b97f" strokeWidth="2" />
        <g fill="#0b1114">
          <path d="M156 420 h240 v80 H156Z" />
          <path d="M0 448 h400 v52 H0Z" />
        </g>
        <g fill="#f0c386" opacity=".8">
          <rect x="222" y="424" width="8" height="10" />
          <rect x="250" y="424" width="8" height="10" />
          <rect x="278" y="424" width="8" height="10" />
        </g>
        <g fill="#0b1114">
          <circle cx="84" cy="432" r="18" />
          <path d="M66 432 h36 l-8 34 h-20Z" />
          <circle cx="120" cy="440" r="14" />
          <path d="M106 440 h28 l-6 26 h-16Z" />
        </g>
        <path d="M40 456 q70 -26 150 -8" stroke="#ffd99a" strokeWidth="2" fill="none" opacity=".35" />
      </svg>
    );
  }

  if (kind === "haor") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b8d7d6" />
            <stop offset="55%" stopColor="#7db4ae" />
            <stop offset="100%" stopColor="#3c7f78" />
          </linearGradient>
          <linearGradient id={id("water")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b9b92" />
            <stop offset="100%" stopColor="#0a2e28" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#${id("sky")})`} />
        <circle cx="92" cy="106" r="38" fill="#f7f0d6" opacity=".7" />
        <g fill="#ffffff" opacity=".45">
          <ellipse cx="270" cy="102" rx="64" ry="16" />
          <ellipse cx="220" cy="120" rx="42" ry="10" />
          <ellipse cx="324" cy="130" rx="38" ry="9" />
        </g>
        <rect y="266" width="400" height="234" fill={`url(#${id("water")})`} />
        <path d="M0 272 q70 -12 140 0 q70 14 140 0 q60 -12 120 2 v24 q-70 14 -140 0 q-70 -14 -140 0 q-60 10 -120 -2Z" fill="#bfe0d5" opacity=".3" />
        <g fill="none" stroke="#d5ece4" strokeWidth="1.4" opacity=".35">
          <path d="M0 330 q50 8 100 0 t100 0 t100 0 t100 0" />
          <path d="M0 372 q50 -8 100 0 t100 0 t100 0 t100 0" />
          <path d="M0 416 q50 8 100 0 t100 0 t100 0 t100 0" />
          <path d="M0 460 q50 -8 100 0 t100 0 t100 0 t100 0" />
        </g>
        <g fill="#0b2e24">
          <path d="M94 346 q42 -16 84 0 l-10 10 q-32 -10 -64 0Z" />
          <path d="M136 310 v36" stroke="#0b2e24" strokeWidth="3" />
          <path d="M136 310 l40 -16 l-6 12Z" />
          <path d="M256 404 q30 -10 58 0 l-7 8 q-22 -7 -44 0Z" />
          <path d="M284 380 v24" stroke="#0b2e24" strokeWidth="2" />
          <path d="M284 380 l28 -10 l-4 8Z" />
        </g>
        <g fill="#0b1f1b" opacity=".8">
          <path d="M40 244 q10 -6 20 0 q-10 -3 -20 0Z" />
          <path d="M70 226 q8 -5 16 0 q-8 -2 -16 0Z" />
          <path d="M330 236 q10 -6 20 0 q-10 -3 -20 0Z" />
        </g>
      </svg>
    );
  }

  // river (default)
  return (
    <svg {...common}>
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6d9a8" />
          <stop offset="45%" stopColor="#e9a878" />
          <stop offset="100%" stopColor="#7a7e5c" />
        </linearGradient>
        <linearGradient id={id("water")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a9a86" />
          <stop offset="60%" stopColor="#2c6254" />
          <stop offset="100%" stopColor="#0b2b22" />
        </linearGradient>
        <linearGradient id={id("bank")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7e9a59" />
          <stop offset="100%" stopColor="#3e5b2f" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#${id("sky")})`} />
      <circle cx="286" cy="142" r="46" fill="#fff0c2" opacity=".88" />
      <path d="M0 250 q90 -34 200 -4 q110 30 200 -12 v100 H0Z" fill={`url(#${id("bank")})`} />
      <path d="M0 322 q120 -26 240 4 q80 20 160 -2 v176 H0Z" fill={`url(#${id("water")})`} />
      <path d="M0 384 q120 -22 240 2 q80 18 160 -4 v16 q-80 20 -160 2 q-120 -24 -240 -2Z" fill="#d9e8d7" opacity=".35" />
      <g fill="#0b2b22">
        <path d="M58 300 q16 -56 32 0Z" />
        <path d="M74 264 q-22 -16 -30 -38 q24 4 32 24Z" />
        <path d="M74 268 q24 -18 36 -46 q2 32 -22 48Z" />
        <path d="M306 302 q14 -48 28 0Z" />
        <path d="M320 270 q-20 -12 -28 -32 q22 4 30 20Z" />
      </g>
      <g>
        <path d="M178 392 q34 -14 68 0 l-10 9 q-24 -9 -48 0Z" fill="#1a3529" />
        <path d="M212 356 v36" stroke="#1a3529" strokeWidth="2.4" />
        <path d="M212 356 l34 -14 l-4 10Z" fill="#e8d4a8" />
        <circle cx="244" cy="370" r="5" fill="#e8d4a8" />
      </g>
      <g fill="none" stroke="#d8e6d3" strokeWidth="1.4" opacity=".3">
        <path d="M0 420 q50 8 100 0 t100 0 t100 0 t100 0" />
        <path d="M0 456 q50 -8 100 0 t100 0 t100 0 t100 0" />
      </g>
      <g fill="#f8f2de" opacity=".55">
        <ellipse cx="128" cy="94" rx="48" ry="11" />
        <ellipse cx="88" cy="110" rx="30" ry="7" />
      </g>
    </svg>
  );
}
