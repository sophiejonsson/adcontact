"use client";

import { useState, useRef } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

type Props = {
  defaultPartNumber?: string;
  /** Shown as a small label above the form. */
  title?: string;
  className?: string;
};

const COUNTRIES = ["Sweden", "Finland", "Norway", "Denmark", "Estonia", "Other"];

export default function QuoteForm({ defaultPartNumber, title, className }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  // Anti-spam: record mount time; bots submit near-instantly.
  const mountedAt = useRef<number>(Date.now());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") || ""),
      company: String(data.get("company") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      country: String(data.get("country") || ""),
      lookingFor: String(data.get("lookingFor") || ""),
      partNumber: String(data.get("partNumber") || ""),
      message: String(data.get("message") || ""),
      // Spam controls
      website: String(data.get("website") || ""), // honeypot (must stay empty)
      elapsedMs: Date.now() - mountedAt.current,
    };

    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setReference(json.referenceId || "");
      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-6 ${className ?? ""}`}>
        <div className="flex items-start gap-3">
          <CheckCircle2 size={22} className="mt-0.5 flex-none text-[#16a34a]" />
          <div>
            <h3 className="font-bold text-[#0a1628]">Request received</h3>
            <p className="mt-1 text-sm text-[#15803d]">
              Thanks — we&apos;ll respond within one business day.
              {reference && <span className="block mt-1 font-mono text-xs text-[#16a34a]">Ref: {reference}</span>}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2.5 text-sm text-[#0a1628] placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20";

  return (
    <form onSubmit={handleSubmit} className={`rounded-2xl border border-[#e5e7eb] bg-white p-6 ${className ?? ""}`}>
      {title && <h3 className="mb-4 text-base font-bold text-[#0a1628]">{title}</h3>}

      {/* Honeypot — hidden from humans, bots tend to fill it */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {defaultPartNumber ? (
        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold text-[#374151]">Part number</label>
          <input
            name="partNumber"
            defaultValue={defaultPartNumber}
            readOnly
            className={`${inputCls} bg-[#f8fafc] font-mono`}
          />
        </div>
      ) : (
        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold text-[#374151]">Part number / manufacturer (optional)</label>
          <input name="partNumber" placeholder="e.g. DT06-2S, AMPSEAL 16…" className={inputCls} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-[#374151]">Name *</label>
          <input name="name" required className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-[#374151]">Company *</label>
          <input name="company" required className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-[#374151]">Email *</label>
          <input name="email" type="email" required className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-[#374151]">Phone</label>
          <input name="phone" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-[#374151]">Country</label>
          <select name="country" defaultValue="Sweden" className={inputCls}>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-[#374151]">
            What do you need? * <span className="font-normal text-[#9ca3af]">(quantity, application, specs)</span>
          </label>
          <textarea name="lookingFor" required rows={4} className={inputCls} />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm text-red-600">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-elevate btn-elevate-amber mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#f59e0b] px-6 py-3 text-sm font-semibold text-[#0a1628] transition-colors hover:bg-[#d97706] disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send quote request
            <ArrowRight size={15} />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-[#9ca3af]">
        We typically respond within one business day. No account needed.
      </p>
    </form>
  );
}
