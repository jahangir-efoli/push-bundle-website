"use client";

import { useEffect, useState } from "react";

/**
 * ShopX 2026 live countdown (event landing page `/shopx`).
 *
 * Client-only: renders neutral placeholders on the server + first paint, then
 * fills in after mount to avoid a hydration mismatch. Gracefully flips to a
 * "live" state during the event day and a "thanks" state afterwards, so the
 * page never shows a negative timer once the QR-code banners are in the wild.
 */

// New World Saigon Hotel, Ho Chi Minh City — ICT (UTC+7). Doors 8:00, close 17:30.
const START = new Date("2026-09-17T08:00:00+07:00").getTime();
const END = new Date("2026-09-17T17:30:00+07:00").getTime();

type Remaining = { d: number; h: number; m: number; s: number };
type State = Remaining | "live" | "over" | null;

function compute(): State {
  const now = Date.now();
  if (now >= END) return "over";
  if (now >= START) return "live";
  const diff = START - now;
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff % 86_400_000) / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1_000),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="grid min-w-[3.75rem] place-items-center rounded-xl border border-white/10 bg-white/5 px-3 py-3 font-display text-3xl font-extrabold tabular-nums text-white shadow-soft backdrop-blur-sm sm:min-w-[4.5rem] sm:text-4xl"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
      >
        {value}
      </div>
      <span className="mt-2 text-[0.65rem] font-semibold uppercase tracking-widest text-white/50">
        {label}
      </span>
    </div>
  );
}

export function ShopxCountdown() {
  const [state, setState] = useState<State>(null);

  useEffect(() => {
    setState(compute());
    const id = setInterval(() => setState(compute()), 1000);
    return () => clearInterval(id);
  }, []);

  if (state === "live") {
    return (
      <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm">
        <span className="relative flex size-2.5">
          <span
            className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: "var(--pb-cyan-400)" }}
          />
          <span
            className="relative inline-flex size-2.5 rounded-full"
            style={{ backgroundColor: "var(--pb-cyan-400)" }}
          />
        </span>
        Live now — come find us at the booth
      </p>
    );
  }

  if (state === "over") {
    return (
      <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 backdrop-blur-sm">
        Thanks for visiting us at ShopX 2026 👋
      </p>
    );
  }

  const r = state; // Remaining | null
  return (
    <div
      className="flex items-end gap-2.5 sm:gap-3.5"
      aria-label="Countdown to ShopX 2026"
    >
      <Unit value={r ? pad(r.d) : "--"} label="Days" />
      <Unit value={r ? pad(r.h) : "--"} label="Hrs" />
      <Unit value={r ? pad(r.m) : "--"} label="Min" />
      <Unit value={r ? pad(r.s) : "--"} label="Sec" />
    </div>
  );
}
