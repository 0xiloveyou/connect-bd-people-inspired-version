import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { districts, divisionOrder } from "./data/districts";
import { cities } from "./data/cities";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Deterministic pseudo random so the demo dataset is stable between runs.
// ---------------------------------------------------------------------------
let seedState = 20261109;
function rand() {
  seedState = (seedState * 1664525 + 1013904223) % 4294967296;
  return seedState / 4294967296;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function int(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const avatarPalette = [
  "#0b6e4f",
  "#0f766e",
  "#155e75",
  "#9f1239",
  "#b45309",
  "#1d4ed8",
  "#7c3aed",
  "#4d7c0f",
  "#0f766e",
  "#a16207",
];

const firstNamesBn = [
  "আব্দুল্লাহ", "আবির", "আরিফ", "আশিক", "বাবুল", "ফাহিম", "ফরহাদ", "হাবিব",
  "হাসান", "ইমরান", "জাহিদ", "জুবায়ের", "কামরুল", "মাহমুদ", "মেহেদী", "মিজান",
  "মনির", "নাঈম", "নাজমুল", "নোমান", "পারভেজ", "রাকিব", "রাশেদ", "রফিক",
  "রেজাউল", "রিপন", "সাকিব", "সালমান", "সাজিদ", "শাকিল", "শামীম", "সোহেল",
  "সুমন", "তানভীর", "তারেক", "তুহিন", "জাকির", "আরমান", "রায়হান", "সাইফুল",
  "সাদিয়া", "নুসরাত", "তাসনিম", "ফারজানা", "সুমাইয়া", "জান্নাতুল", "তানিয়া",
  "রুমা", "মৌসুমী", "শারমিন", "নাজমা", "ফাহমিদা", "রুবিনা", "সাবরিনা",
  "ইশরাত", "লামিয়া", "মেহজাবিন", "সানজিদা", "তৃষা", "প্রিয়াঙ্কা", "রাইসা",
  "আফসানা", "সোনিয়া", "মিতু", "রেখা", "শিল্পী", "বৃষ্টি", "ঝর্ণা", "কাকলি",
  "শাহরিয়ার", "সৈকত", "মাসুদ", "রাসেল", "নয়ন", "প্রান্ত", "অনিক", "দীপু",
  "সাগর", "আকাশ", "বৃষ্টি", "চাঁদ", "রোদ", "পাখি", "নদী", "ভোর",
];

const lastNamesBn = [
  "হোসেন", "রহমান", "ইসলাম", "আহমেদ", "আলী", "মিয়া", "সরকার", "চৌধুরী",
  "হক", "করিম", "উদ্দিন", "জামান", "কবির", "মাহমুদ", "আক্তার", "সুলতানা",
  "খাতুন", "বেগম", "নাসরিন", "ইয়াসমিন", "খান", "শেখ", "মোল্লা", "তালুকদার",
];

const professions = [
  "সফটওয়্যার ইঞ্জিনিয়ার", "ছাত্র", "শিক্ষক", "ডাক্তার", "ব্যবসায়ী",
  "আইটি পেশাজীবী", "নার্স", "শেফ", "গার্মেন্টস কর্মী", "ফ্রিল্যান্সার",
  "গবেষক", "ব্যাংকার", "স্থপতি", "ডিজাইনার", "প্রকৌশলী", "ড্রাইভার",
];

const bios = [
  "প্রবাসে থাকলেও মনটা সবসময় দেশের নদী আর বিকেলের রোদে।",
  "নতুন শহরে নতুন জীবন, কিন্তু দেশের গন্ধ ভোলা যায় না।",
  "পরিবার, বন্ধু আর দেশের খাবার — এই তিনটাই সবচেয়ে বেশি মিস করি।",
  "প্রবাসে বড় হচ্ছি, কিন্তু বাংলা গান আর ঈদের সকালটা এখনো একই।",
  "কাজ আর পড়াশোনার ফাঁকে দেশের খবর দেখি, পরিকল্পনা করি ফেরার।",
  "দেশের মানুষদের সঙ্গে যোগাযোগ রাখতেই এই মানচিত্রে যুক্ত হলাম।",
  "যেখানেই থাকি, দেশ আমাকে ডাকে।",
];

const featured = [
  { name: "Mahmud", city: "dammam", district: "jashore", years: 3, profession: "প্রকৌশলী" },
  { name: "Anik", city: "nicosia", district: "chandpur", years: 1, profession: "ছাত্র" },
  { name: "Zaman Kabir", city: "kristianstad", district: "pirojpur", years: 14, profession: "ব্যবসায়ী" },
  { name: "Md Sanod Islam", city: "male", district: "jhenaidah", years: 1, profession: "শেফ" },
  { name: "Mohiuddin Uddin", city: "kajang", district: "cumilla", years: 1, profession: "গার্মেন্টস কর্মী" },
  { name: "Mohammad Sorwar", city: "mount-ayliff", district: "cumilla", years: 8, profession: "ড্রাইভার" },
  { name: "Khaled H Tahmid", city: "atlanta", district: "sunamganj", years: 5, profession: "সফটওয়্যার ইঞ্জিনিয়ার" },
  { name: "Sawon Miah", city: "singapore", district: "tangail", years: 1, profession: "নির্মাণকর্মী" },
  { name: "Mahadi Hasan", city: "singapore", district: "munshiganj", years: 2, profession: "আইটি পেশাজীবী" },
  { name: "Ashik", city: "bishkek", district: "lakshmipur", years: 12, profession: "ছাত্র" },
  { name: "Murad Tanvir Sarkar", city: "kuala-lumpur", district: "cumilla", years: 1, profession: "ব্যবসায়ী" },
  { name: "Rifat Uddin", city: "dubai", district: "brahmanbaria", years: 4, profession: "ব্যাংকার" },
  { name: "Shanto", city: "riyadh", district: "mymensingh", years: 3, profession: "ড্রাইভার" },
  { name: "শেখ ইউসুফ আলী", city: "al-jubayl", district: "khulna", years: 1, profession: "প্রকৌশলী" },
  { name: "Md. Shahjalal", city: "kumamoto", district: "narsingdi", years: 1, profession: "ছাত্র" },
  { name: "Faysal Bhuiyan", city: "singapore", district: "cumilla", years: 6, profession: "নার্স" },
  { name: "Joy", city: "kajang", district: "chuadanga", years: 3, profession: "শেফ" },
  { name: "safayet hossain", city: "abha", district: "lakshmipur", years: 1, profession: "গার্মেন্টস কর্মী" },
  { name: "Tanjila Akter", city: "london", district: "sylhet", years: 7, profession: "নার্স" },
  { name: "Nusrat Jahan", city: "toronto", district: "dhaka", years: 5, profession: "ডিজাইনার" },
  { name: "Rakib Hasan", city: "doha", district: "noakhali", years: 2, profession: "প্রকৌশলী" },
  { name: "Sumaiya Akter", city: "rome", district: "barishal", years: 4, profession: "ছাত্রী" },
  { name: "Arif Hossain", city: "new-york", district: "chattogram", years: 9, profession: "ব্যবসায়ী" },
  { name: "Jannatul Ferdous", city: "sydney", district: "khulna", years: 3, profession: "গবেষক" },
];

const generalQuiz = [
  {
    question: "বাংলাদেশের রাজধানীর নাম কী?",
    options: ["ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী"],
    answer: 0,
    explanation: "ঢাকা বাংলাদেশের রাজধানী ও সবচেয়ে বড় শহর।",
  },
  {
    question: "বাংলাদেশের জাতীয় ফুল কোনটি?",
    options: ["গোলাপ", "শাপলা", "পদ্ম", "জবা"],
    answer: 1,
    explanation: "শাপলা বাংলাদেশের জাতীয় ফুল।",
  },
  {
    question: "বাংলাদেশে কয়টি বিভাগ আছে?",
    options: ["৬", "৭", "৮", "৯"],
    answer: 2,
    explanation: "বাংলাদেশে ৮টি বিভাগ আছে — ঢাকা, চট্টগ্রাম, রাজশাহী, খুলনা, বরিশাল, সিলেট, রংপুর ও ময়মনসিংহ।",
  },
  {
    question: "বাংলাদেশের সর্বোচ্চ পর্বতশৃঙ্গ কোনটি?",
    options: ["কেওক্রাডাং", "তাজিংডং", "সাকা হাফং", "চিম্বুক"],
    answer: 1,
    explanation: "বান্দরবানের তাজিংডং (বিজয়) বাংলাদেশের সর্বোচ্চ পর্বতশৃঙ্গ।",
  },
  {
    question: "একুশে ফেব্রুয়ারি কীসের জন্য পালিত হয়?",
    options: ["স্বাধীনতা দিবস", "আন্তর্জাতিক মাতৃভাষা দিবস", "বিজয় দিবস", "নববর্ষ"],
    answer: 1,
    explanation: "ভাষা শহীদদের স্মরণে একুশে ফেব্রুয়ারি আন্তর্জাতিক মাতৃভাষা দিবস হিসেবে পালিত হয়।",
  },
  {
    question: "বাংলাদেশের জাতীয় নদী কোনটি?",
    options: ["পদ্মা", "মেঘনা", "যমুনা", "ব্রহ্মপুত্র"],
    answer: 0,
    explanation: "পদ্মা বাংলাদেশের জাতীয় নদী।",
  },
];

const photoSeeds = [
  {
    district: "coxs-bazar",
    title: "সূর্যাস্তের অপেক্ষায়",
    titleBn: "সূর্যাস্তের অপেক্ষায়",
    credit: "প্রবাসে কমিউনিটি",
    art: "beach",
  },
  {
    district: "sylhet",
    title: "চা বাগানের ভোর",
    titleBn: "চা বাগানের ভোর",
    credit: "প্রবাসে কমিউনিটি",
    art: "tea",
  },
  {
    district: "khulna",
    title: "সুন্দরবনের নিঃশব্দতা",
    titleBn: "সুন্দরবনের নিঃশব্দতা",
    credit: "প্রবাসে কমিউনিটি",
    art: "mangrove",
  },
  {
    district: "rangamati",
    title: "পাহাড়ের ওপারে",
    titleBn: "পাহাড়ের ওপারে",
    credit: "প্রবাসে কমিউনিটি",
    art: "hills",
  },
  {
    district: "barishal",
    title: "নদীভরা বিকেল",
    titleBn: "নদীভরা বিকেল",
    credit: "প্রবাসে কমিউনিটি",
    art: "river",
  },
  {
    district: "rajshahi",
    title: "আমের মৌসুম",
    titleBn: "আমের মৌসুম",
    credit: "প্রবাসে কমিউনিটি",
    art: "mango",
  },
  {
    district: "dhaka",
    title: "পুরান ঢাকার সকাল",
    titleBn: "পুরান ঢাকার সকাল",
    credit: "প্রবাসে কমিউনিটি",
    art: "city",
  },
  {
    district: "sunamganj",
    title: "হাওরে বর্ষা",
    titleBn: "হাওরে বর্ষা",
    credit: "প্রবাসে কমিউনিটি",
    art: "haor",
  },
];

async function main() {
  console.log("🌱 Seeding Probashé…");

  // Reset (order matters because of foreign keys)
  await prisma.quizQuestion.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.idea.deleteMany();
  await prisma.user.deleteMany();
  await prisma.city.deleteMany();
  await prisma.district.deleteMany();

  // --- Districts -----------------------------------------------------------
  const districtRecords: Array<{ id: number }> = [];
  for (const d of districts) {
    const storyBn = `${d.nameBn} জেলা বাংলাদেশের ${d.divisionBn} বিভাগের অংশ। ${d.taglineBn} — এই জেলার পরিচয়। এখানকার নদী, বাজার, ধানখেত আর মানুষের আত্মীয়তা প্রবাসে থাকা ${d.nameBn} জেলার প্রতিটি মানুষের গল্পে ফিরে আসে। যেখানেই থাকুক, ${d.nameBn} জেলার মানুষদের হৃদয়ে বাড়ি ফেরার একটা দরজা সবসময় খোলা।`;
    const story = `${d.name} is a district in the ${d.division} division of Bangladesh, known for ${d.taglineBn}. Its rivers, bazaars and warmth travel with every ${d.name} native living abroad.`;
    districtRecords.push(
      await prisma.district.create({
        data: {
          slug: d.slug,
          name: d.name,
          nameBn: d.nameBn,
          division: d.division,
          divisionBn: d.divisionBn,
          lat: d.lat,
          lng: d.lng,
          tagline: d.taglineBn,
          taglineBn: d.taglineBn,
          highlights: d.highlights.join("|"),
          story,
          storyBn,
        },
      }),
    );
  }

  // --- Cities --------------------------------------------------------------
  const cityRecords: Array<{ id: number }> = [];
  for (const c of cities) {
    cityRecords.push(
      await prisma.city.create({
        data: {
          slug: c.slug,
          name: c.name,
          nameBn: c.nameBn,
          country: c.country,
          countryBn: c.countryBn,
          countryCode: c.countryCode,
          lat: c.lat,
          lng: c.lng,
        },
      }),
    );
  }
  const cityBySlug = new Map(cities.map((c, i) => [c.slug, cityRecords[i]]));
  const districtBySlug = new Map(districts.map((d, i) => [d.slug, districtRecords[i]]));

  // --- Demo account --------------------------------------------------------
  const passwordHash = await bcrypt.hash("probash123", 10);
  await prisma.user.create({
    data: {
      name: "তানভীর আহমেদ",
      email: "demo@probash.app",
      passwordHash,
      avatarColor: "#9f1239",
      profession: "সফটওয়্যার ইঞ্জিনিয়ার",
      bio: "প্রবাসে থাকি, কিন্তু দেশের গল্প করতেই ভালো লাগে।",
      cityId: cityBySlug.get("dubai")!.id,
      districtId: districtBySlug.get("dhaka")!.id,
      yearsAbroad: 6,
      isPublic: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 160),
    },
  });

  // --- Generated diaspora community ---------------------------------------
  const totalGenerated = 244;
  const weightedCities = cities.flatMap((c) => Array.from({ length: c.weight }, () => c));
  const now = Date.now();

  for (let i = 0; i < totalGenerated; i++) {
    const city = pick(weightedCities);
    const district = pick(districts);
    const firstName = pick(firstNamesBn);
    const lastName = pick(lastNamesBn);
    const name = `${firstName} ${lastName}`;
    const daysAgo = 2 + Math.floor(rand() * 150);
    const hoursAgo = Math.floor(rand() * 24);
    const createdAt = new Date(now - daysAgo * 86400000 - hoursAgo * 3600000);
    const years = rand() < 0.28 ? 1 : rand() < 0.6 ? int(2, 6) : int(7, 18);
    await prisma.user.create({
      data: {
        name,
        email: `member${i + 1}@probash.demo`,
        avatarColor: pick(avatarPalette),
        profession: rand() < 0.85 ? pick(professions) : null,
        bio: rand() < 0.4 ? pick(bios) : null,
        cityId: cityBySlug.get(city.slug)!.id,
        districtId: districtBySlug.get(district.slug)!.id,
        yearsAbroad: years,
        isPublic: rand() > 0.04,
        createdAt,
      },
    });
  }

  // --- Featured / newest profiles -----------------------------------------
  for (let i = 0; i < featured.length; i++) {
    const f = featured[i];
    await prisma.user.create({
      data: {
        name: f.name,
        email: `featured${i + 1}@probash.demo`,
        avatarColor: avatarPalette[i % avatarPalette.length],
        profession: f.profession,
        bio: i % 3 === 0 ? pick(bios) : null,
        cityId: cityBySlug.get(f.city)!.id,
        districtId: districtBySlug.get(f.district)!.id,
        yearsAbroad: f.years,
        isPublic: true,
        createdAt: new Date(now - i * 1000 * 60 * 52 - 1000 * 60 * 5),
      },
    });
  }

  // --- Quiz questions ------------------------------------------------------
  for (const q of generalQuiz) {
    await prisma.quizQuestion.create({
      data: {
        question: q.question,
        option0: q.options[0],
        option1: q.options[1],
        option2: q.options[2],
        option3: q.options[3],
        answer: q.answer,
        explanation: q.explanation,
      },
    });
  }

  // One auto-generated division question per district.
  for (let i = 0; i < districts.length; i++) {
    const d = districts[i];
    const others = divisionOrder.filter((x) => x !== d.division);
    const wrong = shuffle(others).slice(0, 3);
    const options = shuffle([
      { label: d.divisionBn, correct: true },
      ...wrong.map((w) => {
        const map: Record<string, string> = {
          Dhaka: "ঢাকা",
          Chattogram: "চট্টগ্রাম",
          Rajshahi: "রাজশাহী",
          Khulna: "খুলনা",
          Barishal: "বরিশাল",
          Sylhet: "সিলেট",
          Rangpur: "রংপুর",
          Mymensingh: "ময়মনসিংহ",
        };
        return { label: map[w], correct: false };
      }),
    ]);
    await prisma.quizQuestion.create({
      data: {
        districtId: districtRecords[i].id,
        question: `${d.nameBn} জেলা কোন বিভাগে অবস্থিত?`,
        option0: options[0].label,
        option1: options[1].label,
        option2: options[2].label,
        option3: options[3].label,
        answer: options.findIndex((o) => o.correct),
        explanation: `${d.nameBn} জেলা ${d.divisionBn} বিভাগের অন্তর্ভুক্ত।`,
      },
    });
  }

  // --- Photos of the day ---------------------------------------------------
  for (const p of photoSeeds) {
    await prisma.photo.create({
      data: {
        districtId: districtBySlug.get(p.district)!.id,
        title: p.title,
        titleBn: p.titleBn,
        credit: p.credit,
        art: p.art,
      },
    });
  }

  // --- Ideas ---------------------------------------------------------------
  await prisma.idea.createMany({
    data: [
      {
        name: "রাফি",
        email: "rafi@example.com",
        message: "জেলা ভিত্তিক মিটআপ আয়োজন করলে ভালো হয়।",
      },
      {
        name: "Nabila",
        email: "nabila@example.com",
        message: "প্রবাসে দেশের খাবার রেসিপি আর রেস্টুরেন্টের তালিকা চাই।",
      },
    ],
  });

  const counts = {
    districts: await prisma.district.count(),
    cities: await prisma.city.count(),
    users: await prisma.user.count(),
    quiz: await prisma.quizQuestion.count(),
    photos: await prisma.photo.count(),
  };
  console.log("✅ Seed complete", counts);
  console.log("🔑 Demo login: demo@probash.app / probash123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
