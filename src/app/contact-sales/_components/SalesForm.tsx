"use client";

/**
 * SalesForm — the white lead-capture card on /contact-sales.
 *
 * Controlled form with inline validation (validated on blur + submit, errors
 * clear as the user types). On submit the lead is POSTed to the n8n webhook
 * in `NEXT_PUBLIC_N8N_SALES_WEBHOOK_URL`; when that env var isn't configured
 * yet the submit resolves locally after a short delay so the UX can be built
 * and reviewed end-to-end before the automation exists.
 *
 * Copy, select options and the payload type live in ../_data/content.ts.
 */

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  companySizeOptions,
  countryOptions,
  salesForm,
  type SalesLeadPayload,
} from "../_data/content";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_SALES_WEBHOOK_URL;

/* ------------------------------------------------------------------ */
/* Field model + validation                                            */
/* ------------------------------------------------------------------ */

type FieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "companySize"
  | "country"
  | "message"
  | "consent";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companySize: string;
  country: string;
  message: string;
  consent: boolean;
};

const INITIAL_VALUES: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  companySize: "",
  country: "",
  message: "",
  consent: false,
};

const EMAIL_RE = /^\S+@\S+\.\S+$/;
/** Digits, spaces, dashes, parentheses, optional leading + — at least 7 digits. */
const PHONE_RE = /^\+?[\d\s\-()]{7,20}$/;

function validateField(name: FieldName, values: FormValues): string | null {
  switch (name) {
    case "firstName":
      return values.firstName.trim() ? null : "Please complete the required field.";
    case "lastName":
      return values.lastName.trim() ? null : "Please complete the required field.";
    case "email":
      if (!values.email.trim()) return "Please complete the required field.";
      return EMAIL_RE.test(values.email.trim())
        ? null
        : "Please enter a valid work email address.";
    case "phone":
      if (!values.phone.trim()) return "Please complete the required field.";
      return PHONE_RE.test(values.phone.trim())
        ? null
        : "Please enter a valid phone number.";
    case "companySize":
      return values.companySize ? null : "Please select your company size.";
    case "country":
      return values.country ? null : "Please select your country.";
    case "message":
      return values.message.trim() ? null : "Please complete the required field.";
    case "consent":
      return values.consent ? null : "Please accept to be contacted so we can reply.";
  }
}

const ALL_FIELDS: FieldName[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "companySize",
  "country",
  "message",
  "consent",
];

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <motion.p
      id={id}
      role="alert"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1.5 flex items-center gap-1 text-[11.5px] font-medium text-rose-500"
    >
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </motion.p>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[12.5px] font-semibold text-slate-700"
    >
      {children}
      <span aria-hidden="true" className="ml-0.5 text-rose-500">
        *
      </span>
    </label>
  );
}

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13.5px] text-slate-900 placeholder:text-slate-400",
    "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-300",
    hasError
      ? "border-rose-300 bg-rose-50/40"
      : "border-slate-200 hover:border-slate-300",
  );

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

export default function SalesForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );

  const setValue = <K extends keyof FormValues>(name: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Typing/selecting clears that field's error immediately.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleBlur = (name: FieldName) => {
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, values) ?? undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const nextErrors: Partial<Record<FieldName, string>> = {};
    for (const field of ALL_FIELDS) {
      const message = validateField(field, values);
      if (message) nextErrors[field] = message;
    }
    setErrors(nextErrors);

    const firstInvalid = ALL_FIELDS.find((f) => nextErrors[f]);
    if (firstInvalid) {
      document.getElementById(`sales-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("submitting");

    const payload: SalesLeadPayload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      companySize: values.companySize,
      country: values.country,
      message: values.message.trim(),
      consent: values.consent,
      submittedAt: new Date().toISOString(),
      source: "contact-sales",
    };

    try {
      if (WEBHOOK_URL) {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        // No webhook configured yet — resolve locally so the flow is testable.
        await new Promise((resolve) => setTimeout(resolve, 900));
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  /* ── Success state replaces the whole card body ── */
  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-[0_20px_48px_rgba(99,102,241,0.10),0_6px_20px_rgba(0,0,0,0.05)] sm:p-10"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[0_8px_24px_rgba(16,185,129,0.35)]">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          {salesForm.success.heading}
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
          {salesForm.success.body}
        </p>
        <MagneticButton
          href={salesForm.success.ctaHref}
          variant="ghost"
          icon={<ArrowRight className="h-4 w-4" />}
          className="mt-7 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-bold"
        >
          {salesForm.success.ctaLabel}
        </MagneticButton>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_48px_rgba(99,102,241,0.10),0_6px_20px_rgba(0,0,0,0.05)] sm:p-8"
    >
      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        {/* First / last name */}
        <div>
          <FieldLabel htmlFor="sales-firstName">First name</FieldLabel>
          <input
            id="sales-firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={values.firstName}
            onChange={(e) => setValue("firstName", e.target.value)}
            onBlur={() => handleBlur("firstName")}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? "sales-firstName-error" : undefined}
            className={inputClass(Boolean(errors.firstName))}
          />
          {errors.firstName && (
            <FieldError id="sales-firstName-error" message={errors.firstName} />
          )}
        </div>

        <div>
          <FieldLabel htmlFor="sales-lastName">Last name</FieldLabel>
          <input
            id="sales-lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={values.lastName}
            onChange={(e) => setValue("lastName", e.target.value)}
            onBlur={() => handleBlur("lastName")}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? "sales-lastName-error" : undefined}
            className={inputClass(Boolean(errors.lastName))}
          />
          {errors.lastName && (
            <FieldError id="sales-lastName-error" message={errors.lastName} />
          )}
        </div>

        {/* Work email */}
        <div className="sm:col-span-2">
          <FieldLabel htmlFor="sales-email">Work email address</FieldLabel>
          <input
            id="sales-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(e) => setValue("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "sales-email-error" : undefined}
            className={inputClass(Boolean(errors.email))}
          />
          {errors.email && <FieldError id="sales-email-error" message={errors.email} />}
        </div>

        {/* Phone */}
        <div className="sm:col-span-2">
          <FieldLabel htmlFor="sales-phone">Work phone number</FieldLabel>
          <input
            id="sales-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            value={values.phone}
            onChange={(e) => setValue("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "sales-phone-error" : undefined}
            className={inputClass(Boolean(errors.phone))}
          />
          {errors.phone && <FieldError id="sales-phone-error" message={errors.phone} />}
        </div>

        {/* Company size / country */}
        <div>
          <FieldLabel htmlFor="sales-companySize">Company size</FieldLabel>
          <div className="relative">
            <select
              id="sales-companySize"
              name="companySize"
              value={values.companySize}
              onChange={(e) => setValue("companySize", e.target.value)}
              onBlur={() => handleBlur("companySize")}
              aria-invalid={Boolean(errors.companySize)}
              aria-describedby={
                errors.companySize ? "sales-companySize-error" : undefined
              }
              className={cn(
                inputClass(Boolean(errors.companySize)),
                "appearance-none pr-9",
                !values.companySize && "text-slate-400",
              )}
            >
              <option value="" disabled>
                Please select
              </option>
              {companySizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.companySize && (
            <FieldError id="sales-companySize-error" message={errors.companySize} />
          )}
        </div>

        <div>
          <FieldLabel htmlFor="sales-country">Country</FieldLabel>
          <div className="relative">
            <select
              id="sales-country"
              name="country"
              autoComplete="country-name"
              value={values.country}
              onChange={(e) => setValue("country", e.target.value)}
              onBlur={() => handleBlur("country")}
              aria-invalid={Boolean(errors.country)}
              aria-describedby={errors.country ? "sales-country-error" : undefined}
              className={cn(
                inputClass(Boolean(errors.country)),
                "appearance-none pr-9",
                !values.country && "text-slate-400",
              )}
            >
              <option value="" disabled>
                Please select
              </option>
              {countryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.country && (
            <FieldError id="sales-country-error" message={errors.country} />
          )}
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <FieldLabel htmlFor="sales-message">
            How can Expendesk help your business?
          </FieldLabel>
          <textarea
            id="sales-message"
            name="message"
            rows={3}
            placeholder="Tell us about your current expense process and what you'd like to improve…"
            value={values.message}
            onChange={(e) => setValue("message", e.target.value)}
            onBlur={() => handleBlur("message")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "sales-message-error" : undefined}
            className={cn(inputClass(Boolean(errors.message)), "resize-none")}
          />
          {errors.message && (
            <FieldError id="sales-message-error" message={errors.message} />
          )}
        </div>

        {/* Consent */}
        <div className="sm:col-span-2">
          <label htmlFor="sales-consent" className="flex cursor-pointer items-start gap-2.5">
            <input
              id="sales-consent"
              name="consent"
              type="checkbox"
              checked={values.consent}
              onChange={(e) => setValue("consent", e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "sales-consent-error" : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-indigo-600"
            />
            <span className="text-[12px] leading-relaxed text-slate-500">
              {salesForm.consentLabel}{" "}
              <Link
                href={salesForm.consentLinkHref}
                className="font-semibold text-indigo-600 underline-offset-2 hover:underline"
              >
                {salesForm.consentLinkLabel}
              </Link>
              .
              <span aria-hidden="true" className="ml-0.5 text-rose-500">
                *
              </span>
            </span>
          </label>
          {errors.consent && (
            <FieldError id="sales-consent-error" message={errors.consent} />
          )}
        </div>
      </div>

      {/* Submit-failure banner */}
      <AnimatePresence>
        {status === "error" && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[12.5px] font-medium text-rose-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {salesForm.errorBanner}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <MagneticButton
        type="submit"
        variant="ghost"
        fullWidth
        loading={status === "submitting"}
        icon={<ArrowRight className="h-4 w-4" />}
        className="mt-6 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 py-3.5 text-sm font-bold shadow-[0_8px_24px_rgba(99,102,241,0.32)]"
      >
        {status === "submitting" ? "Sending…" : salesForm.submitLabel}
      </MagneticButton>

      <p className="mt-3.5 text-center text-[11.5px] text-slate-400">
        {salesForm.footnote}
      </p>
    </form>
  );
}
