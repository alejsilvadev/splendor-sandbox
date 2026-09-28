import { BrickScrollSection } from "@/components/brick-scroll-section";
import { BrickInspector } from "@/components/brick-lab-harness";

export default function BrickAnimationLab() {
  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-6 pt-32">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-600">Lab</p>
        <h1 className="mt-1 text-2xl font-semibold text-stone-900">Brick animation</h1>
        <p className="mt-2 text-sm text-stone-500">
          Exploded-diagram brick rocket, built with React Three Fiber. Scroll through the
          full-width section below to trigger it, or use the manual inspector further down.
        </p>
      </div>

      <BrickScrollSection className="mt-8 border-y border-stone-200" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-12 pt-12">
        <BrickInspector />
      </main>
    </>
  );
}
