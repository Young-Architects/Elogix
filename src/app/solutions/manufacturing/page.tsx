import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expense Management for Manufacturing Industries | Expendesk",
  description:
    "Control factory and plant spend with real-time visibility. Purpose-built expense management for manufacturing companies.",
};

export default function ManufacturingSolutionPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-32 text-center bg-gradient-to-b from-violet-50 to-white">
        <span className="mb-4 inline-block rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600">
          Manufacturing
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Expense Management for{" "}
          <span className="text-violet-600">Manufacturing Industries</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Keep every plant, facility, and department on budget. Expendesk gives
          manufacturing teams granular cost control without slowing down
          operations.
        </p>
        <a
          href="#demo"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-transform hover:-translate-y-0.5"
        >
          Book a Demo
        </a>
      </section>

      {/* Key benefits */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-800">
          Built for Manufacturing Operations
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Multi-Site Cost Control",
              desc: "Manage and compare spend across multiple plants and facilities in one dashboard.",
            },
            {
              title: "Purchase Order Matching",
              desc: "Automatically match expenses to POs and flag discrepancies before they escalate.",
            },
            {
              title: "Vendor Spend Analytics",
              desc: "Get clear visibility into supplier and vendor costs to negotiate better rates.",
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
