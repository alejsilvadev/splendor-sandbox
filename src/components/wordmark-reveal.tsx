"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

// Real "SPLENDOR" letterform outlines, extracted from the Karla variable
// font pinned at weight 800 — Karla being the typeface Splendor serves on
// splendordesign.com — so the draw-in follows actual glyph contours rather
// than a hand-drawn approximation. Coordinates are normalized to a 1000-unit
// em with the baseline at y=0, laid out on their true advance widths plus a
// little extra tracking.
const LETTERS = [
  {
    key: "s",
    d: "M337 16Q265 16 203.5 -8.2Q142 -32.5 103.5 -84.2Q65 -136 61 -219H219Q219 -188.5 234.5 -168.5Q250 -148.5 276.8 -139Q303.5 -129.5 336 -129.5Q362 -129.5 384.8 -134Q407.5 -138.5 421.5 -150Q435.5 -161.5 435.5 -181.5Q435.5 -206 420.8 -218Q406 -230 367.5 -245.5L221.5 -309Q149.5 -340 109.5 -382Q69.5 -424 69.5 -496.5Q69.5 -581.5 138.8 -633.8Q208 -686 328.5 -686Q451 -686 516.5 -628.2Q582 -570.5 590 -463.5H433Q427 -496.5 403.8 -519Q380.5 -541.5 328.5 -541.5Q291 -541.5 268 -527.8Q245 -514 245 -493.5Q245 -474.5 259.8 -463.5Q274.5 -452.5 304 -439.5L458.5 -374Q535.5 -340.5 573.2 -295.5Q611 -250.5 611 -187.5Q611 -120 578.8 -74.8Q546.5 -29.5 485.2 -6.8Q424 16 337 16Z",
  },
  {
    key: "p",
    d: "M772.5 0V-671H1030Q1146 -671 1214 -615.2Q1282 -559.5 1282 -450.5Q1282 -342 1214 -285.8Q1146 -229.5 1030 -229.5H933.5V0ZM933.5 -369.5H1030Q1073.5 -369.5 1095.8 -393.8Q1118 -418 1118 -450.5Q1118 -483.5 1095.8 -508Q1073.5 -532.5 1030 -532.5H933.5Z",
  },
  { key: "l", d: "M1565.5 -671V-140H1819V0H1405.5V-671Z" },
  {
    key: "e",
    d: "M1946.5 0V-671H2395V-532.5H2106.5V-403.5H2377V-264.5H2106.5V-140H2395V0Z",
  },
  {
    key: "n",
    d: "M2576.5 -671H2743.5L3013 -265H3002V-671H3162V0H3007.5L2710 -446H2736.5V0H2576.5Z",
  },
  {
    key: "d",
    d: "M3351 -671H3588.5Q3692 -671 3771 -630Q3850 -589 3894.8 -513.8Q3939.5 -438.5 3939.5 -334.5Q3939.5 -232 3894.8 -156.8Q3850 -81.5 3771 -40.8Q3692 0 3588.5 0H3351ZM3511 -524V-146H3588.5Q3643 -146 3682.8 -170.8Q3722.5 -195.5 3744.2 -238Q3766 -280.5 3766 -334.5Q3766 -390.5 3744.2 -433Q3722.5 -475.5 3682.8 -499.8Q3643 -524 3588.5 -524Z",
  },
  {
    key: "o",
    d: "M4361 16Q4265.5 16 4194.2 -24.2Q4123 -64.5 4083.5 -143.2Q4044 -222 4044 -337.5Q4044 -456 4083.5 -533.2Q4123 -610.5 4194.2 -648.2Q4265.5 -686 4361 -686Q4457.5 -686 4529.2 -646.5Q4601 -607 4640.5 -529.5Q4680 -452 4680 -337.5Q4680 -220 4640.5 -141.2Q4601 -62.5 4529.2 -23.2Q4457.5 16 4361 16ZM4361 -127.5Q4431 -127.5 4473 -182.8Q4515 -238 4515 -338.5Q4515 -433 4473 -487.8Q4431 -542.5 4361 -542.5Q4293 -542.5 4251 -487.8Q4209 -433 4209 -337.5Q4209 -238 4251 -182.8Q4293 -127.5 4361 -127.5Z",
  },
  {
    key: "r",
    d: "M4827 0V-671H5089Q5215 -671 5284.8 -613.2Q5354.5 -555.5 5354.5 -458.5Q5354.5 -363.5 5284.8 -306.2Q5215 -249 5089 -249H4987V0ZM5177 0 5013.5 -324H5182.5L5386.5 0ZM4987 -353H5071Q5130.5 -353 5160.2 -377.8Q5190 -402.5 5190 -441Q5190 -481 5164.8 -506.8Q5139.5 -532.5 5089 -532.5H4987Z",
  },
] as const;

// The viewBox is ~5.4k units wide, so stroke widths are scaled up to match —
// these read the same on screen as 6 → 1.5 would on a 785-unit box.
const STROKE_DRAW = 16;
const STROKE_SETTLED = 3;

const LETTER_SELECTORS = LETTERS.map((letter) => `.wm-${letter.key}`);

export function WordmarkReveal() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      videoRef.current?.pause();
      anime.set(LETTER_SELECTORS, { strokeWidth: STROKE_SETTLED, fillOpacity: 1 });
      anime.set(".wm-reveal", { opacity: 1, translateY: 0 });
      anime.set(".wm-rule", { scaleX: 1 });
      return;
    }

    anime.set(LETTER_SELECTORS, { strokeWidth: STROKE_DRAW, fillOpacity: 0 });
    anime.set(".wm-reveal", { opacity: 0, translateY: 14 });
    anime.set(".wm-rule", { scaleX: 0 });

    // Reverse of the intro — undraws the letters, drops the ink, and fades
    // the rule/tagline down. Built up front (autoplay: false) so it can be
    // scrubbed by scroll position once the intro has finished playing.
    // Absolute (not relative) offsets below, so the fill can fade out over
    // a short slice of the timeline (quick, little scroll needed) while the
    // stroke undraw spans nearly the whole thing (slow, most of the scroll).
    const outroTl = anime.timeline({ autoplay: false, easing: "easeInOutQuad" });
    outroTl
      .add({ targets: ".wm-reveal", opacity: [1, 0], translateY: [0, 20], duration: 250 }, 0)
      .add({ targets: ".wm-rule", scaleX: [1, 0], duration: 150 }, 100)
      .add(
        {
          targets: LETTER_SELECTORS,
          fillOpacity: [1, 0],
          strokeWidth: [STROKE_SETTLED, STROKE_DRAW],
          duration: 300,
        },
        0
      )
      .add(
        {
          targets: LETTER_SELECTORS,
          strokeDashoffset: [0, anime.setDashoffset],
          duration: 850,
          delay: anime.stagger(30, { from: "last" }),
        },
        150
      );

    let introDone = false;

    // The hero sits in a sticky wrapper taller than the viewport, so it
    // stays pinned in place while its extra height scrolls underneath —
    // the page doesn't actually move down until that extra room runs out,
    // which is exactly when this progress reaches 1 (fully undrawn).
    function handleScroll() {
      if (!introDone) return;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const raw = total > 0 ? -rect.top / total : 0;
      const progress = Math.min(1, Math.max(0, raw));
      outroTl.seek(outroTl.duration * progress);
    }

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Lock scrolling entirely until the intro finishes drawing — the user
    // shouldn't be able to get ahead of it. Locking on the root element
    // (rather than body) keeps it the same element `scrollbar-gutter:
    // stable` is declared on in globals.css, so the gutter stays reserved
    // the whole time instead of appearing/disappearing and shifting layout.
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    function unlockScroll() {
      root.style.overflow = previousOverflow;
    }

    anime
      .timeline({
        easing: "easeInOutQuad",
        complete: () => {
          introDone = true;
          unlockScroll();
          handleScroll();
        },
      })
      // Eight letters is too many to draw one at a time without the intro
      // dragging, so they overlap on a tight stagger and read as a single
      // stroke travelling left to right across the wordmark.
      .add({
        targets: LETTER_SELECTORS,
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 900,
        delay: anime.stagger(110),
      })
      .add(
        {
          targets: LETTER_SELECTORS,
          fillOpacity: [0, 1],
          strokeWidth: [STROKE_DRAW, STROKE_SETTLED],
          duration: 450,
        },
        "-=150"
      )
      .add({ targets: ".wm-rule", scaleX: [0, 1], duration: 200 }, "-=150")
      .add({ targets: ".wm-reveal", opacity: [0, 1], translateY: [14, 0], duration: 300 }, "-=100");

    return () => {
      window.removeEventListener("scroll", onScroll);
      unlockScroll();
    };
  }, []);

  return (
    <div ref={trackRef} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-10 overflow-hidden bg-ink-950 px-6">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-60 [filter:grayscale(1)]"
          src="/videos/hero.mp4"
          poster="/videos/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-ink-950/85" />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-950/70 via-transparent to-brand-900/30" />

        <svg
          viewBox="-20 -711 5458 751"
          className="relative w-full max-w-[min(92vw,1120px)]"
          role="img"
          aria-label="Splendor"
        >
          <g className="fill-white stroke-white" strokeLinecap="round" strokeLinejoin="round">
            {LETTERS.map((letter) => (
              <path key={letter.key} className={`wm-${letter.key}`} d={letter.d} />
            ))}
          </g>
        </svg>

        <div className="wm-reveal relative flex flex-col items-center gap-5 text-center">
          <div className="wm-rule h-1 w-24 origin-center bg-brand-500" />
          <p className="max-w-2xl text-balance text-xl leading-relaxed text-stone-200 sm:text-2xl">
            We help clients own the conversation before the conversion.
          </p>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-300">
            Red Bank, NJ · Jacksonville, FL
          </p>
        </div>
      </div>
    </div>
  );
}
