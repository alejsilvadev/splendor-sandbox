"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/lib/work";
import { ArrowRightIcon } from "@/components/icons";

// Desktop shows a coverflow of several cards at once; on mobile that made
// each card narrow and oddly tall, so the active card takes up almost the
// full width there instead, with just a small peek of the next one.
const DESKTOP_ACTIVE_WIDTH = 46;
const DESKTOP_ITEM_WIDTH = 24;
const DESKTOP_GAP = 1;
const MOBILE_ACTIVE_WIDTH = 86;
const MOBILE_ITEM_WIDTH = 10;
const MOBILE_GAP = 2;
// Must match the outgoing card's fade duration below (search
// "duration-[100ms]" — Tailwind needs that as a literal string, so it
// can't be generated from this constant). Keep these two in sync by hand.
const TRANSITION_MS = 100;
const AUTOPLAY_MS = 6000;

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServer() {
  return false;
}

// Matches Tailwind's default `sm:` breakpoint.
function subscribeIsDesktop(onChange: () => void) {
  const query = window.matchMedia("(min-width: 640px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function getIsDesktop() {
  return window.matchMedia("(min-width: 640px)").matches;
}
function getIsDesktopServer() {
  return true;
}

export function WorkCarousel({ studies }: { studies: CaseStudy[] }) {
  const isDesktop = useSyncExternalStore(subscribeIsDesktop, getIsDesktop, getIsDesktopServer);
  const activeWidth = isDesktop ? DESKTOP_ACTIVE_WIDTH : MOBILE_ACTIVE_WIDTH;
  const itemWidth = isDesktop ? DESKTOP_ITEM_WIDTH : MOBILE_ITEM_WIDTH;
  const gap = isDesktop ? DESKTOP_GAP : MOBILE_GAP;

  const [activeIndex, setActiveIndex] = useState(0);
  // The card leaving the active slot fades out in place instead of
  // sliding to its new position, while every other card still slides.
  const [outgoingSlug, setOutgoingSlug] = useState<string | null>(null);
  // Once the fade finishes, that card needs to jump to its real (side)
  // position/opacity — but it must do so with no transition at all, or
  // it'd animate (slide + fade back in) from its frozen, invisible spot,
  // which is exactly the motion this is meant to prevent. settledSlug marks
  // it for one paint so that jump renders instantly, then clears so the
  // card goes back to sliding normally on future clicks.
  const [settledSlug, setSettledSlug] = useState<string | null>(null);
  const outgoingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleFrameRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer
  );

  useEffect(() => {
    return () => {
      if (outgoingTimeoutRef.current) clearTimeout(outgoingTimeoutRef.current);
      if (settleFrameRef.current !== null) cancelAnimationFrame(settleFrameRef.current);
    };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const nextIndex = ((index % studies.length) + studies.length) % studies.length;
      if (nextIndex === activeIndex) return;

      const leavingSlug = studies[activeIndex].slug;
      setOutgoingSlug(leavingSlug);
      setActiveIndex(nextIndex);

      if (outgoingTimeoutRef.current) clearTimeout(outgoingTimeoutRef.current);
      outgoingTimeoutRef.current = setTimeout(() => {
        setOutgoingSlug(null);
        setSettledSlug(leavingSlug);
        settleFrameRef.current = requestAnimationFrame(() => {
          settleFrameRef.current = requestAnimationFrame(() => setSettledSlug(null));
        });
      }, TRANSITION_MS);
    },
    [activeIndex, studies]
  );

  // Auto-advance every AUTOPLAY_MS, resetting on any navigation (manual
  // or automatic) so the cadence is always measured from the last slide
  // change. Paused on hover and for prefers-reduced-motion.
  useEffect(() => {
    if (isHovered || reducedMotion || studies.length <= 1) return;
    const timeout = setTimeout(() => goTo(activeIndex + 1), AUTOPLAY_MS);
    return () => clearTimeout(timeout);
  }, [activeIndex, isHovered, reducedMotion, studies.length, goTo]);

  return (
    <div className="w-full">
      <div
        className="relative h-80 w-full overflow-hidden sm:h-[28rem]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {studies.map((study, index) => {
          const offset = (index - activeIndex + studies.length) % studies.length;
          const isActive = offset === 0;
          const isOutgoing = study.slug === outgoingSlug;
          const isSettling = study.slug === settledSlug;

          const left =
            offset === 0 ? 0 : activeWidth + gap + (offset - 1) * (itemWidth + gap);
          const width = isActive ? activeWidth : itemWidth;

          return (
            <div
              key={study.slug}
              role="button"
              tabIndex={0}
              onClick={() => goTo(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  goTo(index);
                }
              }}
              aria-label={
                isActive
                  ? `Open case study: ${study.client}`
                  : `Bring ${study.client} to front`
              }
              className={`absolute h-full cursor-pointer text-left ease-out ${
                isOutgoing
                  ? "transition-opacity duration-[100ms]"
                  : isSettling
                    ? "transition-none"
                    : "transition-all duration-[1200ms]"
              }`}
              style={{
                // The outgoing card stays frozen in the active slot and
                // fades to fully transparent there, instead of also
                // snapping to its new (smaller, repositioned) size at the
                // same instant — that instant resize was what made it
                // read as "disappearing" rather than fading.
                left: isOutgoing ? 0 : `${left}%`,
                width: isOutgoing ? `${activeWidth}%` : `${width}%`,
                opacity: isOutgoing ? 0 : isActive ? 1 : 0.75,
                // Kept below everything else so the incoming card visibly
                // slides in over it as it fades.
                zIndex: isOutgoing ? 0 : studies.length - offset,
              }}
            >
              <article
                className={`relative flex h-full flex-col overflow-hidden rounded-xl ring-1 ring-stone-200 transition-shadow duration-500 ${
                  isActive ? "shadow-xl" : "shadow-sm"
                }`}
              >
                {/* Duotone: desaturate the photo, then lay the brand violet
                    over it with a multiply blend so every card in the rail
                    reads as one branded set rather than ten stock photos.
                    Held at a quarter strength — enough for a consistent cast,
                    not so much that the photography disappears under it. */}
                <Image
                  src={`https://picsum.photos/id/${study.imageId}/640/480`}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 46vw, 86vw"
                  className="object-cover grayscale"
                  priority={isActive}
                />
                <div className="absolute inset-0 bg-brand-800 opacity-25 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />

                <div className="relative mt-auto flex flex-col p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-200">
                    {study.sector}
                  </p>
                  <h3 className="mt-2 line-clamp-3 text-lg font-bold leading-snug text-white sm:text-xl">
                    {study.headline}
                  </h3>
                  <p className="mt-1.5 text-sm text-stone-300">{study.client}</p>

                  {isActive ? (
                    <Link
                      href={`/work/${study.slug}`}
                      className="group mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white hover:text-brand-700"
                      onClick={(event) => event.stopPropagation()}
                    >
                      View case study
                      <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  ) : null}
                </div>
              </article>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-10 sm:gap-5">
        {studies.map((study, index) => (
          <button
            key={study.slug}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to ${study.client}`}
            className={`h-2 rounded-full transition-all duration-300 sm:h-3 ${
              index === activeIndex
                ? "w-8 bg-brand-600 sm:w-20"
                : "w-2 bg-stone-300 hover:bg-stone-400 sm:w-3"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
