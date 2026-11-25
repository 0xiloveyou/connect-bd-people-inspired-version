# প্রবাসে · Probashé

**সারা পৃথিবী থেকে এক সুতোয় দেশে** — বাংলাদেশের প্রবাসীদের জন্য একটি বাংলা-প্রথম মানচিত্র, কমিউনিটি ও শেয়ার কার্ড অ্যাপ। [deshe.app](https://deshe.app/)-এর ধারণায় অনুপ্রাণিত, Next.js + Node.js + Prisma দিয়ে তৈরি।

## যা যা আছে

- **বিশ্ব মানচিত্র** — ১২৮টি শহরে ছড়িয়ে থাকা প্রবাসীদের ইন্টারঅ্যাকটিভ পিন, অঞ্চলভিত্তিক ফিল্টার, সার্চ ও জুম। শহরে ক্লিক করলে সেই শহরের প্রবাসীদের প্রোফাইল দেখা যায়।
- **দূরত্ব ক্যালকুলেটর** — প্রবাসের শহর ও বাড়ির জেলার মধ্যে আনুমানিক দূরত্ব (হ্যাভারসাইন), স্থানীয় সময়ের ইঙ্গিত, ব্রাউজার লোকেশন দিয়ে কাছের শহর খোঁজা।
- **র‍্যাংকিং** — শহর, জেলা ও দেশ অনুযায়ী প্রবাসীদের তালিকা ও বার-চার্ট।
- **৬৪ জেলার পাতা** — প্রতিটি জেলার গল্প, বৈশিষ্ট্য, বাংলাদেশ মানচিত্রে অবস্থান, জেলার প্রবাসী তালিকা, শহরভিত্তিক হিসাব ও ছবি।
- **জেলার কুইজ** — প্রতি জেলায় ৩টি প্রশ্ন; উত্তর সার্ভারে যাচাই হয়, ফলাফল ও ব্যাখ্যা দেখানো হয়।
- **শেয়ার কার্ড** — নাম, শহর, জেলা ও দূরত্বসহ ৪:৫ কার্ড; `html-to-image` দিয়ে PNG ডাউনলোড, Web Share API ও QR কোড।
- **অ্যাকাউন্ট** — ইমেইল/পাসওয়ার্ড সাইন-আপ-লগইন, ঐচ্ছিক Google OAuth, প্রোফাইল সম্পাদনা, পাবলিক/প্রাইভেট নিয়ন্ত্রণ।
- **কমিউনিটি** — লাইভ ফিড, আইডিয়া জমা দেওয়ার ফর্ম ও সাম্প্রতিক আইডিয়ার তালিকা।
- **আইনি পাতা** — বাংলা গোপনীয়তা নীতি ও ব্যবহারের শর্তাবলি, কাস্টম ৪০৪ ও এরর পেজ।

## টেক স্ট্যাক

| স্তর | প্রযুক্তি |
| --- | --- |
| ফ্রেমওয়ার্ক | Next.js 16 (App Router, Turbopack, React Compiler) |
| UI | React 19, Tailwind CSS v4, কাস্টম CSS ডিজাইন সিস্টেম |
| ভাষা | TypeScript |
| ডাটাবেস | Prisma 6 + SQLite (ডেভেলপমেন্ট) |
| অথ | JWT (`jose`) + bcrypt, httpOnly কুকি, ঐচ্ছিক Google OAuth |
| মানচিত্র | `react-simple-maps` (v5), `d3-geo`, Natural Earth 110m |
| অন্যান্য | `lucide-react`, `qrcode`, `html-to-image`, `zod` |

> প্রোডাকশনে যেতে চাইলে `prisma/schema.prisma`-এ `provider = "postgresql"` করে `DATABASE_URL` বদলাও। বাকি কোড অপরিবর্তিত থাকবে।

## শুরু করার নিয়ম

### ১. প্রয়োজন

- Node.js 20 বা তার পরের ভার্সন
- npm

### ২. ইনস্টল

```bash
npm install
```

### ৩. এনভায়রনমেন্ট

রিপোজিটরিতে `.env.example` আছে। `.env` না থাকলে কপি করো:

```bash
copy .env.example .env        # Windows
# cp .env.example .env        # macOS / Linux
```

`.env`-এ অন্তত এই দুটি মান ঠিক করো:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="একটা-লম্বা-র‍্যান্ডম-স্ট্রিং-দাও"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

`AUTH_SECRET` বদলাতে PowerShell-এ:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ৪. ডাটাবেস তৈরি ও সিড

```bash
npm run setup
```

এটি Prisma client generate করে, স্কিমা push করে এবং ৬৪ জেলা, ১২৮ শহর, ২৬৯ জন নমুনা প্রবাসী, ৭০টি কুইজ প্রশ্ন ও ৮টি জেলা-ছবি সিড করে।

### ৫. চালাও

```bash
npm run dev
```

খোলো [http://localhost:3000](http://localhost:3000)।

### ডেমো অ্যাকাউন্ট

| ইমেইল | পাসওয়ার্ড |
| --- | --- |
| `demo@probash.app` | `probash123` |

ডেমো ইউজার: দুবাই, সংযুক্ত আরব আমিরাত · বাড়ি ঢাকা · ৬ বছর প্রবাসে।

## স্ক্রিপ্ট

| কমান্ড | কাজ |
| --- | --- |
| `npm run dev` | ডেভেলপমেন্ট সার্ভার (Turbopack) |
| `npm run build` | প্রোডাকশন বিল্ড |
| `npm start` | বিল্ড করা অ্যাপ চালানো |
| `npm run lint` | ESLint |
| `npm run db:push` | স্কিমা ডাটাবেসে প্রয়োগ |
| `npm run db:seed` | নমুনা ডাটা সিড |
| `npm run db:reset` | ডাটাবেস রিসেট + সিড |
| `npm run db:studio` | Prisma Studio |
| `npm run setup` | generate + push + seed |

## ফোল্ডার কাঠামো

```text
prisma/
  schema.prisma          # District, City, User, QuizQuestion, Photo, Idea
  seed.ts                # ডিটারমিনিস্টিক ডেমো ডাটা
  data/districts.ts      # ৬৪ জেলার তথ্য
  data/cities.ts         # ১২৮ শহরের তথ্য
src/
  app/                   # App Router পেজ ও API রুট
    api/auth/...         # register, login, logout, Google OAuth
    api/members/         # শহরভিত্তিক প্রবাসী তালিকা
    api/quiz/check/      # কুইজ উত্তর যাচাই
    api/ideas/           # আইডিয়া জমা
    api/profile/         # প্রোফাইল পড়া/বদলানো
    card/[id]/           # পাবলিক শেয়ার কার্ড
    districts/[slug]/    # জেলার বিস্তারিত পাতা
    map/ ranking/ idea/ join/ profile/ privacy/ terms/
  components/            # Globe, MapExplorer, DistanceChecker, ShareCard, ...
  lib/                   # prisma, auth, session, queries, distance, format, regions
  data/countries-110m.json
```

## Google সাইন-ইন (ঐচ্ছিক)

1. [Google Cloud Console](https://console.cloud.google.com/) → OAuth consent screen কনফিগার করো।
2. Credentials → OAuth client ID → Web application।
3. Redirect URI:
   ```text
   http://localhost:3000/api/auth/google/callback
   ```
4. `.env`-এ বসাও:
   ```env
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   ```
5. সার্ভার রিস্টার্ট করো। `/join` পেজে Google বাটন দেখা যাবে।

Google কনফিগার না থাকলে ইমেইল/পাসওয়ার্ড দিয়ে সব কাজ চলবে।

## প্রোডাকশন নোট

- `NEXT_PUBLIC_SITE_URL` অবশ্যই পাবলিক HTTPS URL হতে হবে; শেয়ার কার্ডের QR ও মেটাডেটা এটি ব্যবহার করে।
- `AUTH_SECRET` প্রোডাকশনে শক্তিশালী ও গোপন রাখো।
- SQLite শুধু লোকাল/ডেমোর জন্য। একাধিক ইনস্ট্যান্স বা ভার্সেলে চালাতে PostgreSQL-এ যাও:
  1. `prisma/schema.prisma`-এ `provider = "postgresql"` করো।
  2. `DATABASE_URL`-এ Postgres কানেকশন স্ট্রিং দাও।
  3. `npx prisma db push && npx prisma db seed` চালাও।
- সব পেজ ডাইনামিক ডাটা ব্যবহার করে (সেশন/ডাটাবেস), তাই `force-dynamic` দেওয়া আছে। `next.config.ts`-এ Cache Components বন্ধ রাখা হয়েছে।

## গোপনীয়তা ও নিরাপত্তা

- ইমেইল কখনো পাবলিক কার্ড বা মানচিত্রে দেখানো হয় না।
- পাসওয়ার্ড bcrypt হ্যাশ হিসেবে সংরক্ষিত।
- সেশন স্বাক্ষরিত JWT, `httpOnly` + `SameSite=Lax` কুকি।
- ব্যবহারকারী প্রোফাইল প্রাইভেট করলে মানচিত্র, র‍্যাংকিং ও পাবলিক কার্ড থেকে সরে যায়।
- লোকেশন কেবল ব্রাউজারেই হিসাব হয়; সার্ভারে জমা হয় না।

## ডাটা মডেল (সংক্ষেপ)

- **District** — ৬৪ জেলা, বিভাগ, স্থানাঙ্ক, ট্যাগলাইন, গল্প, হাইলাইট।
- **City** — ১২৮ প্রবাসী শহর, দেশ ও স্থানাঙ্ক।
- **User** — নাম, ইমেইল, পাসওয়ার্ড/Google, শহর, জেলা, প্রবাসকাল, পেশা, বায়ো, পাবলিক স্ট্যাটাস।
- **QuizQuestion** — জেলা-নির্দিষ্ট বা সাধারণ প্রশ্ন, ৪ অপশন, সঠিক উত্তর, ব্যাখ্যা।
- **Photo** — জেলা-ভিত্তিক ছবি (লোকাল SVG আর্ট কী)।
- **Idea** — কমিউনিটির আইডিয়া/ফিডব্যাক।

---

ভালোবাসায় তৈরি, বাংলাদেশের প্রবাসীদের জন্য। ♥
