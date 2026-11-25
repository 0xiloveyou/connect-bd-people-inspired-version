import Link from "next/link";
import { bn } from "@/lib/format";
import type { DistrictWithCount, MapCity } from "@/lib/queries";

export function RankingBoards({
  cities,
  districts,
  limit = 5,
}: {
  cities: MapCity[];
  districts: DistrictWithCount[];
  limit?: number;
}) {
  const topCities = cities.slice(0, limit);
  const topDistricts = districts.slice(0, limit);
  const maxCity = topCities[0]?.count ?? 1;
  const maxDistrict = topDistricts[0]?.count ?? 1;

  return (
    <div className="boards">
      <div className="board">
        <div className="board-head">
          <p className="board-title">শহর</p>
          <span className="board-sub">কোথায় বেশি প্রবাসী</span>
        </div>
        {topCities.map((city, index) => (
          <div className="board-row" key={city.id}>
            <span className="board-rank">{bn(index + 1)}</span>
            <span className="board-name">
              {city.nameBn}, <small>{city.countryBn}</small>
            </span>
            <span className="board-count">{bn(city.count)}</span>
            <span className="bar-track">
              <span
                className="bar-fill"
                style={{ width: `${Math.max(6, (city.count / maxCity) * 100)}%` }}
              />
            </span>
          </div>
        ))}
      </div>

      <div className="board">
        <div className="board-head">
          <p className="board-title">জেলা</p>
          <span className="board-sub">কারা সবচেয়ে দূরে</span>
        </div>
        {topDistricts.map((district, index) => (
          <div className="board-row" key={district.id}>
            <span className="board-rank">{bn(index + 1)}</span>
            <span className="board-name">
              <Link href={`/districts/${district.slug}`}>{district.nameBn}</Link>
              <small> · {district.divisionBn}</small>
            </span>
            <span className="board-count">{bn(district.count)}</span>
            <span className="bar-track">
              <span
                className="bar-fill"
                style={{
                  width: `${Math.max(6, (district.count / maxDistrict) * 100)}%`,
                }}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
