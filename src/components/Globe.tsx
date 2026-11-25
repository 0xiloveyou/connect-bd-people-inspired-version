"use client";

import { useEffect, useRef } from "react";
import {
  geoDistance,
  geoGraticule10,
  geoInterpolate,
  geoOrthographic,
  geoPath,
  type GeoPermissibleObjects,
} from "d3-geo";
import { feature } from "topojson-client";
import worldData from "@/data/countries-110m.json";
import type { FeatureCollection, Geometry } from "geojson";

type Marker = {
  nameBn: string;
  lat: number;
  lng: number;
  count: number;
};

type GlobeProps = {
  markers: Marker[];
  total: number;
  countryCount: number;
};

type Rotation = [number, number];

const world = worldData as unknown as {
  objects: { countries: unknown };
};

const countries = feature(
  world as never,
  world.objects.countries as never,
) as unknown as FeatureCollection<Geometry>;

const BANGLADESH: [number, number] = [90.3563, 23.685];

export function Globe({ markers, total, countryCount }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const rotationRef = useRef<Rotation>([-96, -20]);
  const dragRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    let width = 600;
    let height = 600;
    let dpr = 1;
    let visible = true;
    let last = 0;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = Math.max(280, rect.width);
      height = width;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const projection = geoOrthographic()
      .translate([0, 0])
      .scale(1)
      .clipAngle(90)
      .precision(0.6);

    const drawPath = (object: GeoPermissibleObjects) => {
      const path = geoPath(projection, ctx);
      path(object);
    };

    const render = (time: number) => {
      rafRef.current = requestAnimationFrame(render);
      if (!visible) return;
      if (!reduceMotion && time - last < 33) return;
      last = time;

      if (!dragRef.current.active && !reduceMotion) {
        rotationRef.current[0] += 0.028;
      }

      const radius = Math.min(width, height) / 2 - 8;
      projection
        .rotate(rotationRef.current)
        .translate([width / 2, height / 2])
        .scale(radius);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Ocean sphere
      ctx.beginPath();
      drawPath({ type: "Sphere" });
      const ocean = ctx.createRadialGradient(
        width * 0.36,
        height * 0.3,
        radius * 0.1,
        width * 0.5,
        height * 0.5,
        radius,
      );
      ocean.addColorStop(0, "#124836");
      ocean.addColorStop(0.65, "#082b20");
      ocean.addColorStop(1, "#04150f");
      ctx.fillStyle = ocean;
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 217, 154, 0.22)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Graticule
      ctx.beginPath();
      drawPath(geoGraticule10());
      ctx.strokeStyle = "rgba(247, 241, 230, 0.08)";
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // Countries
      for (const ge of countries.features) {
        const isBd = String(ge.id) === "050";
        ctx.beginPath();
        drawPath(ge);
        ctx.fillStyle = isBd ? "rgba(244, 42, 65, 0.75)" : "rgba(23, 82, 63, 0.92)";
        ctx.fill();
        ctx.strokeStyle = isBd
          ? "rgba(255, 217, 154, 0.9)"
          : "rgba(185, 215, 200, 0.17)";
        ctx.lineWidth = isBd ? 1.1 : 0.5;
        ctx.stroke();
      }

      // Soft light from the top-left
      const light = ctx.createRadialGradient(
        width * 0.3,
        height * 0.24,
        radius * 0.05,
        width * 0.36,
        height * 0.3,
        radius * 1.05,
      );
      light.addColorStop(0, "rgba(255, 255, 255, 0.14)");
      light.addColorStop(0.55, "rgba(255, 255, 255, 0.02)");
      light.addColorStop(1, "rgba(0, 0, 0, 0.25)");
      ctx.fillStyle = light;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx.fill();

      // The date line is the back of the globe; markers behind are skipped.
      const center: [number, number] = [
        -rotationRef.current[0],
        -rotationRef.current[1],
      ];
      const isVisible = (lng: number, lat: number) =>
        geoDistance([lng, lat], center) < Math.PI / 2;

      // Threads from home to the diaspora
      ctx.save();
      ctx.setLineDash([2, 3]);
      const top = markers.slice(0, 16);
      top.forEach((marker) => {
        const interpolate = geoInterpolate(BANGLADESH, [marker.lng, marker.lat]);
        const points: [number, number][] = [];
        for (let i = 0; i <= 40; i++) {
          const [lng, lat] = interpolate(i / 40);
          if (!isVisible(lng, lat)) {
            if (points.length > 1) {
              ctx.beginPath();
              points.forEach(([x, y], index) => {
                const p = projection([x, y]);
                if (!p) return;
                if (index === 0) ctx.moveTo(p[0], p[1]);
                else ctx.lineTo(p[0], p[1]);
              });
              ctx.strokeStyle = "rgba(255, 217, 154, 0.22)";
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
            points.length = 0;
            continue;
          }
          const p = projection([lng, lat]);
          if (p) points.push([lng, lat]);
        }
        if (points.length > 1) {
          ctx.beginPath();
          points.forEach(([x, y], index) => {
            const p = projection([x, y]);
            if (!p) return;
            if (index === 0) ctx.moveTo(p[0], p[1]);
            else ctx.lineTo(p[0], p[1]);
          });
          ctx.stroke();
        }
      });
      ctx.restore();

      // Markers
      const t = time / 1000;
      markers.forEach((marker, index) => {
        if (!isVisible(marker.lng, marker.lat)) return;
        const p = projection([marker.lng, marker.lat]);
        if (!p) return;
        const [x, y] = p;
        const base = 1.5 + Math.min(3.6, Math.sqrt(marker.count) * 0.75);
        const pulse = (Math.sin(t * 1.4 + index * 0.9) + 1) / 2;

        ctx.beginPath();
        ctx.arc(x, y, base + 3 + pulse * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 217, 154, ${0.04 + pulse * 0.07})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, base, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 217, 154, 0.92)";
        ctx.fill();
        ctx.strokeStyle = "rgba(4, 20, 15, 0.65)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      // Home marker — always on the visible side at the initial rotation.
      if (isVisible(BANGLADESH[0], BANGLADESH[1])) {
        const p = projection(BANGLADESH);
        if (p) {
          const [x, y] = p;
          ctx.beginPath();
          ctx.arc(x, y, 9, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(244, 42, 65, 0.2)";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, 4.4, 0, Math.PI * 2);
          ctx.fillStyle = "#f42a41";
          ctx.fill();
          ctx.strokeStyle = "#fff4de";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (parent) observer.observe(parent);

    const intersection = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    intersection.observe(canvas);

    rafRef.current = requestAnimationFrame(render);

    const onPointerDown = (event: PointerEvent) => {
      dragRef.current = { x: event.clientX, y: event.clientY, active: true };
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragRef.current.active) return;
      const dx = event.clientX - dragRef.current.x;
      const dy = event.clientY - dragRef.current.y;
      dragRef.current.x = event.clientX;
      dragRef.current.y = event.clientY;
      rotationRef.current[0] += dx * 0.35;
      rotationRef.current[1] = Math.max(
        -70,
        Math.min(70, rotationRef.current[1] - dy * 0.3),
      );
    };
    const onPointerUp = () => {
      dragRef.current.active = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, [markers]);

  return (
    <div className="globe-shell">
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        role="img"
        aria-label={`পৃথিবীর মানচিত্রে ${total} জন প্রবাসী বাংলাদেশি`}
      />
      <div className="globe-orbit" aria-hidden="true" />

      <div className="globe-chip globe-chip-top">
        <span>
          <b>{countryCount > 0 ? countryCount : 40}+</b>
          <small>দেশে ছড়িয়ে</small>
        </span>
        <span className="live-dot" aria-hidden="true" />
      </div>

      <div className="globe-chip globe-chip-bottom">
        <span>
          <b>{total.toLocaleString("bn-BD")}</b>
          <small>জন প্রবাসী মানচিত্রে</small>
        </span>
      </div>

      <div className="globe-legend" aria-hidden="true">
        <span>
          <i /> প্রবাসী
        </span>
        <span>
          <i /> বাংলাদেশ
        </span>
      </div>

      <span className="globe-hint">টেনে ঘোরাও · ভালোবাসায় এঁকেছি</span>
    </div>
  );
}
