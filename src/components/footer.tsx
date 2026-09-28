import { ArrowUpRightIcon } from "@/components/icons";

const BUILDER_LINKS = [
  { label: "GitHub", href: "https://github.com/alejsilvadev" },
  { label: "Portfolio", href: "https://silvadevelopment.com/portfolio" },
  { label: "contactalejsilva@gmail.com", href: "mailto:contactalejsilva@gmail.com" },
  { label: "(908) 947-5781", href: "tel:+19089475781" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-stone-300">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <p className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-[72px] lg:leading-[1.05]">
          LET&apos;S TALK.
        </p>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-400">
          This is a sandbox — a working Next.js build put together to show what I&apos;d
          bring to Splendor&apos;s web team.
        </p>

        <div className="mt-14 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-300">
              About the agency
            </p>
            <p className="mt-4 leading-relaxed text-stone-400">
              Splendor is a full-service creative agency in Red Bank, NJ, with a second
              office in Jacksonville, FL.
            </p>
            <a
              href="https://splendordesign.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors hover:text-brand-300"
            >
              splendordesign.com
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-300">
              About the build
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {BUILDER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-stone-300 transition-colors hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-xs leading-relaxed text-stone-500">
            Unaffiliated fan project built by Alejandro Silva. Not an official Splendor
            website. Case study headlines and agency facts are referenced from
            splendordesign.com; all supporting copy is written for this demo.
          </p>
          <p className="shrink-0 text-xs text-stone-500">© {year} Alejandro Silva</p>
        </div>
      </div>
    </footer>
  );
}
