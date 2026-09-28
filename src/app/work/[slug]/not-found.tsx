import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-12 pt-32">
      <div className="rounded-r-lg border-l-4 border-brand-600 bg-white py-6 pl-6 pr-8 shadow-sm">
        <p className="text-stone-700">That case study doesn&apos;t exist.</p>
        <Link
          href="/work"
          className="group mt-4 inline-flex items-center gap-1.5 text-sm text-brand-700 hover:text-brand-900"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to all work
        </Link>
      </div>
    </main>
  );
}
