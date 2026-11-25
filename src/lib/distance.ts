export type Coordinates = {
  lat: number;
  lng: number;
};

const EARTH_RADIUS_KM = 6371.0088;

/** Great-circle distance between two points, in kilometres. */
export function haversineKm(from: Coordinates, to: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Approximate local time using longitude, for a lightweight "clock" hint. */
export function approximateLocalTime(lng: number, now = new Date()): string {
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const offsetMinutes = Math.round(lng / 15) * 60;
  const total = (utcMinutes + offsetMinutes + 24 * 60) % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
}
