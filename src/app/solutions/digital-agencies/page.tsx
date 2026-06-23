/**
 * /solutions/digital-agencies — static, SEO-focused industry landing page.
 *
 * One of three sibling pages under `solutions/` (manufacturing, pharmaceutical,
 * digital-agencies), linked from the Navbar "Solutions" dropdown. Each is fully
 * self-contained: copy is inline here (these do NOT use the `src/data/` JSON
 * pattern that the home-page sections use). Prerendered as static HTML at build.
 *
 * `#demo` CTA anchors are placeholders — there is no demo section yet.
 */
import type { Metadata } from "next";
import MagneticButton from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "Expense Management for Digital Agencies | Expendesk",
  description:
    "Track project budgets and client billing with precision. Expense management built for digital agencies and creative teams.",
};

export default function DigitalAgenciesSolutionPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-32 text-center bg-gradient-to-b from-fuchsia-50 to-white">
        <span className="mb-4 inline-block rounded-full bg-fuchsia-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-fuchsia-600">
          Digital Agencies
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Expense Management for{" "}
          <span className="text-fuchsia-600">Digital Agencies</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Stop losing margin to untracked spend. Expendesk lets agencies link
          every expense to a project and client — so billing is accurate and
          profitability is always clear.
        </p>
        <MagneticButton
          href="#demo"
          variant="primary"
          className="mt-8 rounded-full px-7 py-3 text-sm shadow-lg shadow-fuchsia-500/30"
        >
          Book a Demo
        </MagneticButton>
      </section>

      {/* Key benefits */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-800">
          Built for Agency Workflows
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Project-Level Budgets",
              desc: "Assign budgets per project or client and get alerts before you go over.",
            },
            {
              title: "Client Billing Sync",
              desc: "Tag expenses as billable or non-billable and export directly to invoices.",
            },
            {
              title: "Team Spend Cards",
              desc: "Issue virtual cards to team members with pre-set limits per campaign.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-2 text-base font-semibold text-slate-800">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
