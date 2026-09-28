"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const BrickAnimationScene = dynamic(() => import("@/components/brick-animation-scene"), {
  ssr: false,
  loading: () => null,
});

const TRACK_HEIGHT_VH = 320;

export function BrickScrollSection({ className }: { className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function update() {
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const raw = total > 0 ? -rect.top / total : 0;
      progressRef.current = Math.min(1, Math.max(0, raw));
    }

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={trackRef} className={className} style={{ height: `${TRACK_HEIGHT_VH}vh` }}>
      <div className="sticky top-0 h-screen">
        <BrickAnimationScene progressRef={progressRef} className="h-full w-full" />
      </div>
    </div>
  );
}
