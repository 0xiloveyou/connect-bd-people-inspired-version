import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { distanceForMember } from "@/lib/queries";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cityId = Number(url.searchParams.get("cityId"));
  const districtId = Number(url.searchParams.get("districtId"));
  const countryCode = url.searchParams.get("countryCode");
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 8));

  const users = await prisma.user.findMany({
    where: {
      isPublic: true,
      ...(Number.isFinite(cityId) && cityId > 0 ? { cityId } : {}),
      ...(Number.isFinite(districtId) && districtId > 0 ? { districtId } : {}),
      ...(countryCode ? { city: { is: { countryCode } } } : {}),
    },
    select: {
      id: true,
      name: true,
      avatarColor: true,
      photoUrl: true,
      profession: true,
      yearsAbroad: true,
      createdAt: true,
      city: {
        select: {
          id: true,
          nameBn: true,
          countryBn: true,
          countryCode: true,
          lat: true,
          lng: true,
        },
      },
      district: {
        select: { id: true, nameBn: true, slug: true, lat: true, lng: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({
    members: users.map((user) => ({
      ...user,
      distanceKm: distanceForMember(user),
    })),
  });
}
