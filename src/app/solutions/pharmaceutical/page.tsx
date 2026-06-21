import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expense Management for Pharmaceutical Industries | Expendesk",
  description:
    "Streamline compliance and audit-ready expense reporting for pharmaceutical companies with Expendesk.",
};

export default function PharmaceuticalSolutionPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-32 text-center bg-gradient-to-b from-indigo-50 to-white">
        <span className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600">
          Pharmaceutical
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Expense Management for{" "}
          <span className="text-indigo-600">Pharmaceutical Industries</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Stay audit-ready and fully compliant. Expendesk gives pharmaceutical
          teams real-time visibility into every expense — from clinical trials to
          sales rep reimbursements.
        </p>
        <a
          href="#demo"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5"
        >
          Book a Demo
        </a>
      </section>

      {/* Key benefits */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-800">
          Built for Pharma Compliance
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Regulatory Compliance",
              desc: "Automatic policy checks aligned with pharma spend reporting requirements.",
            },
            {
              title: "Audit-Ready Reports",
              desc: "One-click export of expense data formatted for internal and external audits.",
            },
            {
              title: "HCP Spend Tracking",
              desc: "Accurately track and report healthcare professional interaction expenses.",
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
