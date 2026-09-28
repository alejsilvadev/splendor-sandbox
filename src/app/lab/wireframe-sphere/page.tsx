import { WireframeSphereLoader } from "@/components/wireframe-sphere-loader";

export default function WireframeSphereLab() {
  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-6 pt-32">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-600">Lab</p>
        <h1 className="mt-1 text-2xl font-semibold text-stone-900">Wireframe sphere</h1>
        <p className="mt-2 text-sm text-stone-500">
          A scroll-synced line-draw, in the spirit of anime.js&apos;s own Scroll Observer demo.
          Scroll through the full-width section below to trigger it.
        </p>
      </div>

      <div className="mt-8">
        <WireframeSphereLoader />
      </div>
    </>
  );
}
