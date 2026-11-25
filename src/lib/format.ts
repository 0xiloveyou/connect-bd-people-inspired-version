const bnFormatter = new Intl.NumberFormat("bn-BD");
const bnFormatterCompact = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 0,
});

export function bn(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return String(value);
  return bnFormatter.format(n);
}

/** Bengali digits, capped at 99k for huge numbers. */
export function bnShort(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    return `${bnFormatterCompact.format(Number(k.toFixed(1)))} হাজার`;
  }
  return bn(value);
}

export function bnDate(date: Date | string, withYear = true): string {
  const d = typeof date === "string" ? new Date(date) : date;
  try {
    return new Intl.DateTimeFormat("bn-BD", {
      day: "numeric",
      month: "long",
      ...(withYear ? { year: "numeric" } : {}),
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

export function bnMonthYear(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  try {
    return new Intl.DateTimeFormat("bn-BD", {
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 7);
  }
}

export function timeAgoBn(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "এইমাত্র";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${bn(minutes)} মিনিট আগে`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${bn(hours)} ঘণ্টা আগে`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${bn(days)} দিন আগে`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${bn(months)} মাস আগে`;
  return `${bn(Math.floor(months / 12))} বছর আগে`;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return Array.from(parts[0]).slice(0, 2).join("");
  return `${Array.from(parts[0])[0]}${Array.from(parts[parts.length - 1])[0]}`;
}

export function formatKm(km: number): string {
  return `${bn(Math.round(km))} কিমি`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
