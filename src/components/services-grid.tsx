"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Service } from "@/lib/work";

export function ServicesGrid({ services }: { services: Service[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(container.querySelectorAll("[data-service-card]"));
    gsap.set(cards, { opacity: 0, y: 24 });

    // Staggered in only once the grid is actually on screen — running it on
    // mount would burn the animation while the section is still four
    // viewports below the fold.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.09,
          });
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="grid gap-px overflow-hidden rounded-2xl bg-stone-200 sm:grid-cols-2">
      {services.map((service, index) => (
        <article
          key={service.id}
          data-service-card
          className="group relative bg-white p-8 transition-colors duration-300 hover:bg-brand-50 sm:p-10"
        >
          <span className="text-xs font-bold tabular-nums text-brand-600">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-stone-900">
            {service.id}
          </h3>
          <p className="mt-3 max-w-sm leading-relaxed text-stone-600">{service.blurb}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {service.capabilities.map((capability) => (
              <li
                key={capability}
                className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 transition-colors duration-300 group-hover:bg-white group-hover:text-brand-700"
              >
                {capability}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
