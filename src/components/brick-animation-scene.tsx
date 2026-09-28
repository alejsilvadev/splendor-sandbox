"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Edges, RoundedBoxGeometry } from "@react-three/drei";
import { Shape, type Group } from "three";
import { pieceMeta, getPieceTransform, type PieceMeta } from "@/lib/brick-model";

// a solid pie-slice, centered on its own bisector, extruded along local Z.
// used for wedges that make up a ring; ExtrudeGeometry (unlike a partial
// CylinderGeometry) closes the two flat cut faces, so it never renders hollow
function buildWedgeShape(radius: number, angle: number): Shape {
  const half = angle / 2;
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.lineTo(radius * Math.cos(-half), radius * Math.sin(-half));
  shape.absarc(0, 0, radius, -half, half, false);
  shape.lineTo(0, 0);
  return shape;
}

const STUD_RADIUS = 0.14;
const STUD_HEIGHT = 0.14;

type BrickAnimationSceneProps = {
  interactive?: boolean;
  /** Low-frequency progress source, e.g. a lab slider. Ignored when progressRef is set. */
  progress?: number;
  /** High-frequency progress source (mutated every scroll tick, no React re-render). */
  progressRef?: RefObject<number>;
  forceReducedMotion?: boolean;
  className?: string;
};

export default function BrickAnimationScene({
  interactive = false,
  progress = 0,
  progressRef,
  forceReducedMotion = false,
  className,
}: BrickAnimationSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  // safe to read matchMedia synchronously here: this component only ever
  // renders client-side, via next/dynamic with ssr:false
  const [osReducedMotion, setOsReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => setOsReducedMotion(event.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  const reducedMotion = forceReducedMotion || osReducedMotion;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const frameloop = reducedMotion ? "demand" : isVisible ? "always" : "never";

  return (
    <div ref={containerRef} className={`bg-stone-200 ${className ?? ""}`}>
      <Canvas frameloop={frameloop} camera={{ position: [9, 4.5, 10], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, -4]} intensity={0.9} />
        <directionalLight position={[-4, 3, 5]} intensity={0.3} />

        <BrickPieces progress={reducedMotion ? 0 : progress} progressRef={reducedMotion ? undefined : progressRef} />

        <ContactShadows position={[0, -0.05, 0]} opacity={0.3} scale={12} blur={2.5} far={4} />

        {interactive && (
          <OrbitControls enablePan={false} minDistance={7} maxDistance={26} target={[0, 3.2, 0]} />
        )}
      </Canvas>
    </div>
  );
}

function BrickPieces({
  progress,
  progressRef,
}: {
  progress: number;
  progressRef?: RefObject<number>;
}) {
  const internalProgressRef = useRef(0);
  const groupRefs = useRef<(Group | null)[]>([]);

  useEffect(() => {
    if (!progressRef) {
      internalProgressRef.current = Math.min(1, Math.max(0, progress));
    }
  }, [progress, progressRef]);

  useFrame(() => {
    const current = progressRef ? progressRef.current : internalProgressRef.current;

    pieceMeta.forEach((meta, index) => {
      const group = groupRefs.current[index];
      if (!group) return;
      const { position, rotation, opacity } = getPieceTransform(meta, current);
      group.position.set(position[0], position[1], position[2]);
      group.rotation.set(rotation[0], rotation[1], rotation[2]);
      group.traverse((child) => {
        const mesh = child as unknown as { material?: { transparent: boolean; opacity: number } };
        if (mesh.material) {
          mesh.material.transparent = true;
          mesh.material.opacity = opacity * (meta.opacity ?? 1);
        }
      });
    });
  });

  return (
    <>
      {pieceMeta.map((meta, index) => (
        <group
          key={meta.id}
          position={meta.assembledPosition}
          rotation={meta.rotation}
          ref={(el) => {
            groupRefs.current[index] = el;
          }}
        >
          <BrickMesh piece={meta} />
        </group>
      ))}
    </>
  );
}

function BrickMesh({ piece }: { piece: PieceMeta }) {
  const [w, h, d] = piece.size;
  const isCylinder = piece.shape === "cylinder";
  const isSphere = piece.shape === "sphere";
  const isWedge = piece.shape === "wedge";
  const isBox = !isCylinder && !isSphere && !isWedge;
  const studPositions = piece.studs && isBox ? buildStudGrid(w, d) : [];

  const wedgeShape = useMemo(
    () => (isWedge ? buildWedgeShape(w / 2, (Math.PI * 2) / (piece.wedgeCount ?? 6)) : null),
    [isWedge, w, piece.wedgeCount]
  );

  // a rounded box's bevel (and a wedge's swept arc) introduces many
  // shallow-angle facets; a wide threshold keeps outlines at the real
  // panel edges instead of the curve
  const boxRadius = Math.min(0.06, Math.min(w, h, d) * 0.22);

  return (
    <>
      <mesh
        scale={isSphere ? [w / 2, h / 2, d / 2] : [1, 1, 1]}
        position={isWedge ? [0, -h / 2, 0] : [0, 0, 0]}
        rotation={isWedge ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}
      >
        {isSphere && <sphereGeometry args={[1, 24, 16]} />}
        {isCylinder && <cylinderGeometry args={[(w / 2) * (piece.taper ?? 1), w / 2, h, 24]} />}
        {isBox && <RoundedBoxGeometry args={[w, h, d]} radius={boxRadius} smoothness={3} />}
        {isWedge && wedgeShape && (
          <extrudeGeometry args={[wedgeShape, { depth: h, bevelEnabled: false, curveSegments: 8 }]} />
        )}
        <meshStandardMaterial color={piece.color} roughness={0.6} metalness={0.02} transparent />
        {!isSphere && <Edges threshold={isBox || isWedge ? 45 : 15} color="black" lineWidth={1} />}
      </mesh>
      {studPositions.map(([sx, sz], i) => (
        <mesh key={i} position={[sx, h / 2 + STUD_HEIGHT / 2, sz]}>
          <cylinderGeometry args={[STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, 16]} />
          <meshStandardMaterial color={piece.color} roughness={0.6} metalness={0.02} transparent />
          <Edges threshold={15} color="black" lineWidth={1} />
        </mesh>
      ))}
    </>
  );
}

function buildStudGrid(width: number, depth: number): [number, number][] {
  const countX = Math.max(1, Math.round(width));
  const countZ = Math.max(1, Math.round(depth));
  const positions: [number, number][] = [];

  for (let ix = 0; ix < countX; ix++) {
    for (let iz = 0; iz < countZ; iz++) {
      const x = -width / 2 + (ix + 0.5) * (width / countX);
      const z = -depth / 2 + (iz + 0.5) * (depth / countZ);
      positions.push([x, z]);
    }
  }

  return positions;
}
