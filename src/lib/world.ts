import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import worldData from "@/data/countries-110m.json";

const world = worldData as unknown as {
  objects: { countries: unknown };
};

export const BANGLADESH_COORDS: [number, number] = [90.3563, 23.685];
export const BANGLADESH_FEATURE_ID = "050";

let cached: FeatureCollection<Geometry> | null = null;

/** Natural Earth 110m countries converted to GeoJSON, cached per process. */
export function getWorldGeo(): FeatureCollection<Geometry> {
  if (cached) return cached;
  cached = feature(
    world as never,
    world.objects.countries as never,
  ) as unknown as FeatureCollection<Geometry>;
  return cached;
}
