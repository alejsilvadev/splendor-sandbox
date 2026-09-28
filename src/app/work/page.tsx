import type { Metadata } from "next";
import { WorkIndex } from "@/components/work-index";

export const metadata: Metadata = {
  title: "Work — Splendor Sandbox",
  description:
    "Selected Splendor case studies across branding, web design, digital marketing and content.",
};

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-32">
      <p className="text-[18px] font-bold uppercase tracking-[0.18em] leading-[28px] text-brand-600">
        Work
      </p>
      <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
        Twenty-seven years of owning the conversation.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
        Filtered client-side from this app&apos;s own{" "}
        <code className="rounded bg-stone-100 px-1.5 py-0.5 text-[0.9em] text-brand-700">
          /api/work
        </code>{" "}
        endpoint — loading and error states included.
      </p>

      <div className="mt-12">
        <WorkIndex />
      </div>
    </main>
  );
}
