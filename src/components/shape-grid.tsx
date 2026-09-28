"use client";

import { useLayoutEffect, useRef, useState } from "react";
import anime from "animejs";

const COLS = 6;
const ROWS = 4;
const TILE_COUNT = COLS * ROWS;

type ShapeKind = "circle" | "square" | "triangle" | "diamond";

const SHAPE_SEQUENCE: ShapeKind[] = ["circle", "square", "triangle", "diamond"];

function shapeFor(index: number): ShapeKind {
  return SHAPE_SEQUENCE[index % SHAPE_SEQUENCE.length];
}

// a scattered handful of tiles pick up the brand accent instead of neutral ink
function isAccent(index: number): boolean {
  return index % 5 === 2;
}

export function ShapeGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [replayKey, setReplayKey] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tiles = tileRefs.current.filter((t): t is HTMLDivElement => t !== null);
    anime.set(tiles, { scale: 0, opacity: 0, translateY: 16 });

    let played = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played) return;
        played = true;
        anime({
          targets: tiles,
          scale: [0, 1],
          opacity: [0, 1],
          translateY: [16, 0],
          easing: "easeOutElastic(1, .6)",
          duration: 900,
          delay: anime.stagger(40, { grid: [COLS, ROWS], from: "center" }),
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [replayKey]);

  function handleHover(index: number) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tile = tileRefs.current[index];
    if (!tile) return;
    anime({
      targets: tile,
      scale: [1, 1.08, 1],
      rotate: ["0deg", "-4deg", "0deg"],
      duration: 420,
      easing: "easeInOutQuad",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        ref={containerRef}
        key={replayKey}
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: TILE_COUNT }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            onMouseEnter={() => handleHover(i)}
            className={
              isAccent(i)
                ? "flex aspect-square items-center justify-center rounded-xl border border-brand-200 bg-brand-50"
                : "flex aspect-square items-center justify-center rounded-xl border border-stone-200 bg-white"
            }
          >
            <ShapeIcon kind={shapeFor(i)} accent={isAccent(i)} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setReplayKey((k) => k + 1)}
        className="self-start rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 hover:border-brand-300 hover:text-brand-800"
      >
        Replay
      </button>
    </div>
  );
}

function ShapeIcon({ kind, accent }: { kind: ShapeKind; accent: boolean }) {
  const color = accent ? "#f40333" : "#1c1917";

  return (
    <svg width={28} height={28} viewBox="0 0 28 28" aria-hidden>
      {kind === "circle" && <circle cx="14" cy="14" r="11" fill={color} />}
      {kind === "square" && <rect x="4" y="4" width="20" height="20" rx="4" fill={color} />}
      {kind === "triangle" && <polygon points="14,3 25,24 3,24" fill={color} />}
      {kind === "diamond" && <polygon points="14,2 26,14 14,26 2,14" fill={color} />}
    </svg>
  );
}
