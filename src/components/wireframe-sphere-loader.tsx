"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const WireframeSphere = dynamic(
  () => import("@/components/wireframe-sphere").then((mod) => mod.WireframeSphere),
  {
    ssr: false,
    loading: () => <div className="h-[100vh] bg-background" />,
  }
);

interface WireframeSphereLoaderProps {
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  backgroundClassName?: string;
  showScrollCue?: boolean;
}

export function WireframeSphereLoader({
  leftSlot,
  rightSlot,
  backgroundClassName,
  showScrollCue,
}: WireframeSphereLoaderProps) {
  return (
    <WireframeSphere
      leftSlot={leftSlot}
      rightSlot={rightSlot}
      backgroundClassName={backgroundClassName}
      showScrollCue={showScrollCue}
    />
  );
}
