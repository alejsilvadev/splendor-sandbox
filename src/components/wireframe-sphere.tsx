"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDownIcon } from "@/components/icons";

const SIZE = 480;
const CENTER = SIZE / 2;
const RADIUS = 180;
const LINE_COUNT = 15;
const TILT_DEG = 42;
// the tilt angle itself never changes — only the compass direction it points
// sweeps around, the way Earth's axis stays pointed at Polaris while the
// hemisphere it leans toward the sun rotates through the year. Sweeping this
// azimuth is a rigid rotation of the whole sphere around its own center, so
// the outer silhouette stays a perfect circle throughout — nothing squashes.
// At azimuth 0 every latitude ellipse is axis-aligned and centered on the
// vertical midline, so that base pattern is already its own mirror image —
// which means the mirror of the azimuth-θ pattern is exactly the azimuth-(-θ)
// pattern. Ending the sweep at the negated start angle therefore lands on a
// true horizontal flip of the starting look, with no reflection transform
// (and none of the squash a scaleX-based flip would need) ever required.
const AZIMUTH_START_DEG = -20;
const AZIMUTH_END_DEG = -AZIMUTH_START_DEG;
const TRACK_HEIGHT_VH = 420;
const BRAND_VIOLET = "#6e00bc";

// scroll progress runs through three sequential phases: the lines draw in
// on the right, the fully-drawn sphere then slides over to the left, and
// only once it's in place does it "unravel" — the same segment-reveal
// mechanic run in reverse, chasing the tail up to the head
const DRAW_END = 0.35;
const MOVE_END = 0.65;
const STAGGER_SPAN = 0.88;

// every ring would otherwise start its path at the same point in local
// coordinates (an ellipse's natural t=0), which — after the shared azimuth
// rotation — lines every ring's draw/unravel start up along one straight
// radial cut. Each ring's path is built (see buildRingPath below) starting
// from a point nudged a little further around its own circumference than
// the last, turning that straight cut into a mild spiral without wrapping
// all the way around — baked into the geometry itself, rather than faked
// with stroke-dashoffset, so the draw and unravel animations stay exactly
// as clean as they were with a shared start point
const SPIRAL_OFFSET_FRACTION = 0.16;

// fractions of the component's own rendered width, not the viewport — so the
// sphere's travel scales correctly whether it's full-bleed (the lab page) or
// boxed into a narrower content column (the homepage section)
const X_START_FRACTION = 0.26;
const X_END_FRACTION = -0.26;

// the left slot fades/slides down into frame while the section is still
// approaching — finishing by the time it's actually reached, so it's
// already showing on arrival — then exits early in the move phase, well
// before the sphere's circle (measured, not its square SVG box) ever
// reaches that side. The right slot stays hidden until the sphere is nearly
// all the way to its final position on the left, so the two never visibly
// overlap; it then stays put through almost the whole unravel and only
// exits, the same way the left slot did, right at the end — once the
// sphere itself is almost completely unraveled and gone
const TEXT_LEFT_ENTER_LEAD_VH = 0.5;
const TEXT_LEFT_EXIT_SPAN = 0.4;
const TEXT_ENTER_START = 0.78;
const TEXT_ENTER_SPAN = 0.22;
const TEXT_RIGHT_EXIT_START = 0.8;
const TEXT_RIGHT_EXIT_SPAN = 0.2;
const TEXT_SLIDE_OFFSET = 90;

// idle "breathing" ripple: each line oscillates along the sphere's own tilt
// axis, and lines further down lag further behind in phase — so at any
// instant the top line is already reversing while the ones below it are
// still catching up, reading as a wave that travels down the sphere and
// back. Stroke width rides the same wave, in phase with the vertical
// motion, so each line visibly swells as it moves and thins as it settles
const BREATH_AMPLITUDE = 12;
const BREATH_PERIOD_S = 3.4;
const BREATH_PHASE_STEP = (1.6 * Math.PI) / (LINE_COUNT - 1);
const BREATH_WIDTH_BASE = 2;
const BREATH_WIDTH_AMPLITUDE = 0.9;
const BREATH_WIDTH_MIN = 1.3;

// true parallels of latitude on a sphere tilted toward the viewer by
// TILT_DEG. Latitude circles lie in parallel planes (hence "parallel" to
// each other), and under orthographic projection each one becomes an
// axis-aligned ellipse — no rotation transforms needed. Derivation: a point
// at latitude phi, tilted by beta around X and projected along Z, traces
// X = R cos(phi) sin(theta), Y = R sin(phi) cos(beta) - R cos(phi) sin(beta) cos(theta),
// which is an ellipse of half-width R cos(phi), half-height R cos(phi) sin(beta),
// centered R sin(phi) cos(beta) away from the sphere's own center.
const TILT_RAD = (TILT_DEG * Math.PI) / 180;
const SIN_TILT = Math.sin(TILT_RAD);
const COS_TILT = Math.cos(TILT_RAD);

// a full ellipse needs two arc commands (a single elliptical-arc can't sweep
// a whole 360°) — traced as two 180° halves starting from `startAngle`, so
// getTotalLength()/dasharray-based reveal logic works exactly like it would
// on a plain <ellipse>, just beginning at a rotated point on the ring
function buildRingPath(cx: number, cy: number, rx: number, ry: number, startAngle: number) {
  const startX = cx + rx * Math.cos(startAngle);
  const startY = cy + ry * Math.sin(startAngle);
  const midAngle = startAngle + Math.PI;
  const midX = cx + rx * Math.cos(midAngle);
  const midY = cy + ry * Math.sin(midAngle);
  return `M ${startX} ${startY} A ${rx} ${ry} 0 1 1 ${midX} ${midY} A ${rx} ${ry} 0 1 1 ${startX} ${startY}`;
}

const LINES = Array.from({ length: LINE_COUNT }, (_, i) => {
  const latDeg = -80 + (i * 160) / (LINE_COUNT - 1);
  const lat = (latDeg * Math.PI) / 180;
  const rx = RADIUS * Math.cos(lat);
  const ry = rx * SIN_TILT;
  const cy = CENTER + RADIUS * Math.sin(lat) * COS_TILT;
  const spiralFraction = (i / (LINE_COUNT - 1)) * SPIRAL_OFFSET_FRACTION;

  return {
    id: `line-${i}`,
    d: buildRingPath(CENTER, cy, rx, ry, spiralFraction * 2 * Math.PI),
  };
});

function clamp01(t: number): number {
  return Math.min(1, Math.max(0, t));
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// how far along its own stagger slot a line is, given a 0-1 phase progress.
// `order` is the line's rank in the start sequence (0 = starts first), not
// necessarily its array index — draw goes top-to-bottom, unravel reverses it
function staggeredLocal(phaseT: number, order: number): number {
  const localStart = (order / LINE_COUNT) * STAGGER_SPAN;
  const raw = (phaseT - localStart) / Math.max(1e-4, 1 - localStart);
  return easeInOutCubic(clamp01(raw));
}

interface WireframeSphereProps {
  // fades/slides in on the left once the section is scrolled into, then
  // fades/slides away as the sphere starts moving left; rightSlot enters
  // and exits the same way, timed around the sphere's own move/unravel
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  // Tailwind background class for the sticky stage — defaults to the plain
  // white the lab page was tuned against; the homepage passes the site's
  // own background token so the section reads as part of the page
  backgroundClassName?: string;
  showScrollCue?: boolean;
}

export function WireframeSphere({
  leftSlot,
  rightSlot,
  backgroundClassName = "bg-white",
  showScrollCue = true,
}: WireframeSphereProps = {}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const leftSlotRef = useRef<HTMLDivElement>(null);
  const rightSlotRef = useRef<HTMLDivElement>(null);
  // safe to read matchMedia synchronously here: this component only ever
  // renders client-side, via next/dynamic with ssr:false
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const svg = svgRef.current;
    if (!track || !svg || reducedMotion) return;

    const lines = Array.from(svg.querySelectorAll<SVGGeometryElement>(".sphere-line"));
    const lengths = lines.map((line) => line.getTotalLength());

    if (cueRef.current) cueRef.current.style.opacity = "1";

    function applySegment(index: number, start: number, end: number) {
      const line = lines[index];
      const length = lengths[index];
      const visible = Math.max(0, end - start) * length;
      line.style.strokeDasharray = `0 ${start * length} ${visible} ${length * 2}`;
    }

    function update() {
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const raw = total > 0 ? -rect.top / total : 0;
      const progress = clamp01(raw);

      lines.forEach((_, index) => {
        if (progress <= DRAW_END) {
          // top lines (low index) start drawing first
          const phaseT = progress / DRAW_END;
          applySegment(index, 0, staggeredLocal(phaseT, index));
        } else if (progress <= MOVE_END) {
          applySegment(index, 0, 1);
        } else {
          // reversed: bottom lines (high index) start unraveling first
          const phaseT = (progress - MOVE_END) / (1 - MOVE_END);
          const order = LINE_COUNT - 1 - index;
          applySegment(index, staggeredLocal(phaseT, order), 1);
        }
      });

      let moveT = 0;
      if (progress > DRAW_END) {
        moveT = clamp01((progress - DRAW_END) / (MOVE_END - DRAW_END));
      }
      const eased = easeInOutCubic(moveT);

      let unravelT = 0;
      if (progress > MOVE_END) {
        unravelT = clamp01((progress - MOVE_END) / (1 - MOVE_END));
      }

      if (stageRef.current && containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        const fraction = X_START_FRACTION + (X_END_FRACTION - X_START_FRACTION) * eased;
        stageRef.current.style.transform = `translateX(${fraction * width}px)`;
      }

      if (groupRef.current) {
        const azimuth = AZIMUTH_START_DEG + (AZIMUTH_END_DEG - AZIMUTH_START_DEG) * eased;
        groupRef.current.setAttribute("transform", `rotate(${azimuth} ${CENTER} ${CENTER})`);
      }

      // left slot: fades/slides down into frame while the section is still
      // approaching (rect.top counts down from a lead distance to 0, then
      // keeps going negative — clamp01 holds the result at 1 from then on),
      // so it's already fully in place by the time the section is reached;
      // later fades/slides away, once, well clear of the sphere before it
      // ever crosses into that side
      const enterLeadPx = window.innerHeight * TEXT_LEFT_ENTER_LEAD_VH;
      const leftEnterEased = easeInOutCubic(clamp01(1 - rect.top / enterLeadPx));
      const leftExitEased = easeInOutCubic(clamp01(moveT / TEXT_LEFT_EXIT_SPAN));
      if (leftSlotRef.current) {
        const leftOpacity = leftEnterEased * (1 - leftExitEased);
        const leftY = -TEXT_SLIDE_OFFSET * (1 - leftEnterEased) + TEXT_SLIDE_OFFSET * leftExitEased;
        leftSlotRef.current.style.opacity = String(leftOpacity);
        leftSlotRef.current.style.transform = `translateY(calc(-50% + ${leftY}px))`;
      }

      // right slot: stays hidden until the sphere is nearly at its final
      // position, then fades/slides down INTO frame from above; it stays
      // put through nearly the whole unravel and only fades/slides down
      // OUT right at the end, once the sphere is almost completely gone
      const rightEnterEased = easeInOutCubic(
        clamp01((moveT - TEXT_ENTER_START) / TEXT_ENTER_SPAN)
      );
      const rightExitEased = easeInOutCubic(
        clamp01((unravelT - TEXT_RIGHT_EXIT_START) / TEXT_RIGHT_EXIT_SPAN)
      );
      if (rightSlotRef.current) {
        const rightOpacity = rightEnterEased * (1 - rightExitEased);
        const rightY = -TEXT_SLIDE_OFFSET * (1 - rightEnterEased) + TEXT_SLIDE_OFFSET * rightExitEased;
        rightSlotRef.current.style.opacity = String(rightOpacity);
        rightSlotRef.current.style.transform = `translateY(calc(-50% + ${rightY}px))`;
      }

      if (cueRef.current) cueRef.current.style.opacity = progress > 0.03 ? "0" : "1";
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
  }, [reducedMotion]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || reducedMotion) return;

    const lines = Array.from(svg.querySelectorAll<SVGGeometryElement>(".sphere-line"));
    const omega = (2 * Math.PI) / BREATH_PERIOD_S;
    const start = performance.now();
    let raf = 0;

    function tick(now: number) {
      const t = (now - start) / 1000;
      lines.forEach((line, index) => {
        const phase = t * omega - index * BREATH_PHASE_STEP;
        const wave = Math.sin(phase);
        const offset = wave * BREATH_AMPLITUDE;
        line.style.transform = `translateY(${offset}px)`;
        const width = Math.max(BREATH_WIDTH_MIN, BREATH_WIDTH_BASE + wave * BREATH_WIDTH_AMPLITUDE);
        line.style.strokeWidth = String(width);
      });
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  return (
    <div ref={trackRef} className="relative" style={{ height: `${TRACK_HEIGHT_VH}vh` }}>
      <div
        ref={containerRef}
        className={`sticky top-0 flex h-screen flex-col items-center justify-center gap-8 overflow-hidden ${backgroundClassName}`}
      >
        {leftSlot && (
          <div
            ref={leftSlotRef}
            className="pointer-events-none absolute left-0 top-1/2 w-full max-w-sm px-6 sm:max-w-md md:px-12 lg:max-w-lg"
            style={{ opacity: 0, transform: "translateY(-50%)" }}
          >
            {leftSlot}
          </div>
        )}

        {rightSlot && (
          <div
            ref={rightSlotRef}
            className="pointer-events-none absolute right-0 top-1/2 w-full max-w-sm px-6 sm:max-w-md md:px-12 lg:max-w-lg"
            style={{ opacity: 0, transform: "translateY(-50%)" }}
          >
            {rightSlot}
          </div>
        )}

        {showScrollCue && (
          <div
            ref={cueRef}
            className="absolute top-24 flex flex-col items-center gap-2 text-xs text-stone-400 opacity-0 transition-opacity duration-300"
          >
            <span>Scroll</span>
            <ArrowDownIcon className="h-3 w-3" />
          </div>
        )}

        <div ref={stageRef} className="hidden h-[68vmin] w-[68vmin] sm:block">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            fill="none"
            className="h-full w-full"
            role="img"
            aria-label="A wireframe sphere"
          >
            <g ref={groupRef} transform={`rotate(${AZIMUTH_START_DEG} ${CENTER} ${CENTER})`}>
              {LINES.map((line) => (
                <path
                  key={line.id}
                  className="sphere-line"
                  d={line.d}
                  stroke={BRAND_VIOLET}
                  strokeOpacity={0.9}
                  strokeWidth={2}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
