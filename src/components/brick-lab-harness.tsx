"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const BrickAnimationScene = dynamic(() => import("@/components/brick-animation-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[560px] items-center justify-center rounded-xl border border-stone-200 bg-white text-sm text-stone-400">
      Loading scene...
    </div>
  ),
});

export function BrickInspector() {
  const [manualProgress, setManualProgress] = useState(0);
  const [previewReducedMotion, setPreviewReducedMotion] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-stone-500">
        Manual inspector &mdash; scrub to any frame directly, or preview the reduced-motion
        fallback.
      </p>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <BrickAnimationScene
          interactive
          progress={manualProgress}
          forceReducedMotion={previewReducedMotion}
          className="h-[480px] w-full"
        />
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-5">
        <label className="flex items-center gap-2 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={previewReducedMotion}
            onChange={(event) => setPreviewReducedMotion(event.target.checked)}
            className="h-4 w-4 accent-brand-600"
          />
          Preview reduced motion
        </label>

        <label className="flex flex-col gap-2 text-sm text-stone-600">
          <span>
            Manual scrub{" "}
            <span className="tabular-nums text-stone-400">({Math.round(manualProgress * 100)}%)</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(manualProgress * 100)}
            onChange={(event) => setManualProgress(Number(event.target.value) / 100)}
            className="accent-brand-600"
          />
        </label>
      </div>
    </div>
  );
}
