import { ShapeGrid } from "@/components/shape-grid";
import { ArrowDownIcon } from "@/components/icons";

export default function ShapeGridLab() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-12 pt-32">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-600">Lab</p>
        <h1 className="mt-1 text-2xl font-semibold text-stone-900">Shape grid</h1>
        <p className="mt-2 text-sm text-stone-500">
          A staggered grid entrance, in the spirit of anime.js&apos;s own homepage. Scroll down
          to trigger it, or hit replay.
        </p>
      </div>

      <div className="flex h-[100vh] flex-col items-center justify-center gap-2 text-xs text-stone-400">
        <span>Scroll</span>
        <ArrowDownIcon className="h-3 w-3" />
      </div>

      <ShapeGrid />
    </main>
  );
}
