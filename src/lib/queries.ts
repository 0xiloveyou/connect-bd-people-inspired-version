import { prisma } from "./prisma";
import { haversineKm } from "./distance";

const publicUserWhere = { isPublic: true } as const;

export type MapCity = Awaited<ReturnType<typeof getMapCities>>[number];
export type DistrictWithCount = Awaited<ReturnType<typeof getAllDistricts>>[number];

export async function getMapCities() {
  const cities = await prisma.city.findMany({
    include: {
      _count: {
        select: { users: { where: publicUserWhere } },
      },
    },
    orderBy: { name: "asc" },
  });

  return cities
    .map((city) => ({
      id: city.id,
      slug: city.slug,
      name: city.name,
      nameBn: city.nameBn,
      country: city.country,
      countryBn: city.countryBn,
      countryCode: city.countryCode,
      lat: city.lat,
      lng: city.lng,
      count: city._count.users,
    }))
    .filter((city) => city.count > 0)
    .sort((a, b) => b.count - a.count);
}

export async function getTopCountries() {
  const cities = await getMapCities();
  const map = new Map<
    string,
    { code: string; name: string; nameBn: string; count: number; cities: number }
  >();
  for (const city of cities) {
    const current = map.get(city.countryCode);
    if (current) {
      current.count += city.count;
      current.cities += 1;
    } else {
      map.set(city.countryCode, {
        code: city.countryCode,
        name: city.country,
        nameBn: city.countryBn,
        count: city.count,
        cities: 1,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export async function getLatestMembers(limit = 12) {
  return prisma.user.findMany({
    where: publicUserWhere,
    include: { city: true, district: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAllDistricts() {
  const districts = await prisma.district.findMany({
    include: {
      _count: {
        select: { users: { where: publicUserWhere } },
      },
    },
    orderBy: { name: "asc" },
  });
  return districts
    .map((district) => ({
      id: district.id,
      slug: district.slug,
      name: district.name,
      nameBn: district.nameBn,
      division: district.division,
      divisionBn: district.divisionBn,
      lat: district.lat,
      lng: district.lng,
      taglineBn: district.taglineBn,
      highlights: district.highlights,
      count: district._count.users,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function getTopDistricts(limit = 10) {
  const districts = await getAllDistricts();
  return districts.slice(0, limit);
}

export async function getStats() {
  const [total, cities, countries, districts] = await Promise.all([
    prisma.user.count({ where: publicUserWhere }),
    getMapCities(),
    getTopCountries(),
    prisma.district.count({
      where: { users: { some: publicUserWhere } },
    }),
  ]);

  return {
    total,
    cityCount: cities.length,
    countryCount: countries.length,
    districtCount: districts,
    cities,
    countries,
  };
}

export async function getPhotos(limit = 5) {
  return prisma.photo.findMany({
    include: { district: true },
    orderBy: { id: "asc" },
    take: limit,
  });
}

export async function getDistrictBySlug(slug: string) {
  return prisma.district.findUnique({
    where: { slug },
    include: {
      users: {
        where: publicUserWhere,
        include: { city: true },
        orderBy: { createdAt: "desc" },
      },
      photos: { take: 1 },
    },
  });
}

export async function getDistrictBySlugForMeta(slug: string) {
  return prisma.district.findUnique({
    where: { slug },
    select: { name: true, nameBn: true, taglineBn: true, divisionBn: true },
  });
}

export async function getQuizForDistrict(districtId: number) {
  const [specific, general] = await Promise.all([
    prisma.quizQuestion.findMany({
      where: { districtId },
      take: 1,
    }),
    prisma.quizQuestion.findMany({
      where: { districtId: null },
    }),
  ]);

  return [...specific, ...general.slice(0, 2)].map((q) => ({
    id: q.id,
    question: q.question,
    options: [q.option0, q.option1, q.option2, q.option3],
  }));
}

export async function getIdeas(limit = 6) {
  return prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getUserCard(id: number) {
  return prisma.user.findUnique({
    where: { id },
    include: { city: true, district: true },
  });
}

export async function getCityOptions() {
  return prisma.city.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      nameBn: true,
      country: true,
      countryBn: true,
      lat: true,
      lng: true,
    },
    orderBy: [{ country: "asc" }, { name: "asc" }],
  });
}

export async function getDistrictOptions() {
  return prisma.district.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      nameBn: true,
      divisionBn: true,
      lat: true,
      lng: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getMembersByCity(cityId: number, limit = 8) {
  return prisma.user.findMany({
    where: { ...publicUserWhere, cityId },
    select: {
      id: true,
      name: true,
      avatarColor: true,
      photoUrl: true,
      yearsAbroad: true,
      profession: true,
      createdAt: true,
      city: { select: { nameBn: true, countryBn: true, lat: true, lng: true } },
      district: { select: { nameBn: true, lat: true, lng: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export function distanceForMember(user: {
  city: { lat: number; lng: number } | null;
  district: { lat: number; lng: number } | null;
}): number | null {
  if (!user.city || !user.district) return null;
  return Math.round(
    haversineKm(
      { lat: user.city.lat, lng: user.city.lng },
      { lat: user.district.lat, lng: user.district.lng },
    ),
  );
}

export function withDistance<
  T extends {
    city: { lat: number; lng: number } | null;
    district: { lat: number; lng: number } | null;
  },
>(user: T): T & { distanceKm: number | null } {
  return { ...user, distanceKm: distanceForMember(user) };
}
