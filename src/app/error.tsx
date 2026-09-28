"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-12 pt-32">
      <div className="rounded-r-lg border-l-4 border-rose-400 bg-white py-6 pl-6 pr-8 shadow-sm">
        <p className="text-stone-700">Couldn&apos;t load the work.</p>
        <button
          onClick={reset}
          className="mt-4 rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
