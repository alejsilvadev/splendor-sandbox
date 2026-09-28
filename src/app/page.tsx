import { CASE_STUDIES, SERVICES, AGENCY_FACTS } from "@/lib/work";
import { ViewedCounterBadge } from "@/components/viewed-counter-badge";
import { WorkShowcase } from "@/components/work-showcase";
import { ServicesGrid } from "@/components/services-grid";
import { WordmarkReveal } from "@/components/wordmark-reveal";
import { WireframeSphereLoader } from "@/components/wireframe-sphere-loader";

export default function Home() {
  return (
    <>
      <WordmarkReveal />

      <section id="approach" className="mx-auto w-full max-w-6xl px-6">
        <WireframeSphereLoader
          backgroundClassName="bg-background"
          showScrollCue={false}
          leftSlot={
            <>
              <p className="text-[18px] font-bold uppercase tracking-[0.18em] leading-[28px] text-brand-600">
                Look first
              </p>
              <p className="mt-4 text-2xl leading-relaxed text-stone-600">
                Splendor&apos;s role is not only to create, but to look. Not only to
                answer, but to ask. Twenty-seven years in, that order still holds — the
                questions come before the comps, and what a company is actually good at
                comes before what it wants to say.
              </p>
            </>
          }
          rightSlot={
            <>
              <p className="text-[18px] font-bold uppercase tracking-[0.18em] leading-[28px] text-brand-600">
                Then create
              </p>
              <p className="mt-4 text-2xl leading-relaxed text-stone-600">
                Uncover what makes a company unique in its space. Discover how to tell
                that story so it stands out. Create enough interest to build real brand
                affinity — and drive the growth that follows it.
              </p>
            </>
          }
        />
      </section>

      <section id="services" className="border-t border-stone-200 bg-stone-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <p className="text-[18px] font-bold uppercase tracking-[0.18em] leading-[28px] text-brand-600">
            Services
          </p>
          <h2 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Rooted in the principles of design.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
            Splendor is a full-service creative agency working across branding, custom
            web design, digital marketing and content strategy — usually all four at once
            for the same client.
          </p>

          <div className="mt-12">
            <ServicesGrid services={SERVICES} />
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-stone-200 lg:grid-cols-4">
            {AGENCY_FACTS.map((fact) => (
              <div key={fact.label} className="bg-white px-6 py-8">
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  <span className="block text-3xl font-bold tracking-tight text-brand-600 sm:text-4xl">
                    {fact.value}
                  </span>
                  <span className="mt-2 block text-sm leading-snug text-stone-500">
                    {fact.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <main
        id="work"
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-24"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[18px] font-bold uppercase tracking-[0.18em] leading-[28px] text-brand-600">
              Selected work
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Own the conversation.
            </h2>
          </div>
          <ViewedCounterBadge />
        </div>

        <WorkShowcase initialStudies={CASE_STUDIES} />
      </main>
    </>
  );
}
