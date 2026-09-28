"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/" },
  { id: "approach", label: "Approach", href: "/#approach" },
  { id: "services", label: "Services", href: "/#services" },
  { id: "work", label: "Work", href: "/work" },
] as const;

const SECTION_IDS = ["approach", "services", "work"];

type IndicatorRect = { left: number; top: number; width: number; height: number };

export function Navbar() {
  const pathname = usePathname();
  const [scrollActive, setScrollActive] = useState<string>("home");
  const active = pathname !== "/" ? "work" : scrollActive;

  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null);

  // Slide the highlight pill to whichever tab is active, instead of just
  // swapping which link has a background.
  useEffect(() => {
    function measure() {
      const link = linkRefs.current[active];
      if (!link) return;
      setIndicator({
        left: link.offsetLeft,
        top: link.offsetTop,
        width: link.offsetWidth,
        height: link.offsetHeight,
      });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    // Trigger line sits just below the floating pill nav. Whichever
    // section's top has scrolled above it (last, in document order)
    // is the active one — this works regardless of how tall or short
    // a given section is, unlike comparing IntersectionObserver ratios.
    const TRIGGER_OFFSET = 120;

    function update() {
      let current = "home";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= TRIGGER_OFFSET) {
          current = section.id;
        }
      }

      // The last section can be shorter than the viewport, in which case
      // its top can never scroll up to the trigger line before the page
      // runs out of room to scroll — the document simply isn't tall
      // enough. Treat "scrolled to the bottom" as activating it too.
      // Guarded on scrollY > 0 so a short page doesn't already read as
      // "at the bottom" while still sitting untouched at the top on load.
      const atBottom =
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        current = sections[sections.length - 1].id;
      }

      setScrollActive(current);
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
    window.addEventListener("resize", onScroll, { passive: true });

    // Section positions aren't reliable the instant this effect runs —
    // in dev, CSS applies asynchronously after the initial paint, so the
    // hero can briefly report zero height, which would lock in the wrong
    // active section forever since nothing else re-triggers a measurement
    // until the user scrolls. Re-measure whenever the page's actual
    // rendered size changes (CSS applying, fonts swapping in, etc.),
    // not just on a fixed timer/frame guess.
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(document.body);

    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      resizeObserver.disconnect();
    };
  }, [pathname]);

  return (
    <nav className="fixed inset-x-0 top-6 z-50 flex justify-center px-6">
      <div className="relative flex items-center gap-1 rounded-full bg-ink-950/90 p-1.5 text-sm text-stone-300 shadow-lg shadow-ink-950/25 backdrop-blur">
        {indicator && (
          <div
            aria-hidden
            className="absolute rounded-full bg-brand-600 transition-all duration-300 ease-out"
            style={{
              left: indicator.left,
              top: indicator.top,
              width: indicator.width,
              height: indicator.height,
            }}
          />
        )}
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => {
                linkRefs.current[item.id] = el;
              }}
              onClick={(e) => {
                // Clicking a hash link that already matches the current
                // URL hash is a browser no-op — it won't re-scroll even
                // if the user has since scrolled away manually. Only
                // relevant when we're already on "/"; a route change
                // (e.g. from /work/[slug]) should navigate normally.
                if (pathname !== "/") return;
                // "Work" points at a real route, not a section anchor —
                // let the router handle it.
                if (!item.href.startsWith("/#")) return;
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

                e.preventDefault();
                if (item.id === "home") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }
                window.history.pushState(null, "", item.href);
              }}
              className={
                isActive
                  ? "relative rounded-full px-4 py-2 font-medium text-white"
                  : "relative rounded-full px-4 py-2 font-medium transition-colors hover:bg-white/10 hover:text-white"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
