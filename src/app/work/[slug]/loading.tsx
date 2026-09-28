export default function Loading() {
  return (
    <main
      className="flex min-h-screen w-full items-center justify-center bg-ink-950"
      role="status"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      <span className="sr-only">Loading case study</span>
    </main>
  );
}
