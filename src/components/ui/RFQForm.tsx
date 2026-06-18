"use client";

import { useRef, useState } from "react";
import { Send, Upload, CheckCircle, Loader2 } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  lookingFor: string;
  partNumber: string;
  message: string;
};

const initialData: FormData = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "Sweden",
  lookingFor: "",
  partNumber: "",
  message: "",
};

const countries = [
  "Sweden", "Finland", "Norway", "Denmark", "Estonia",
  "Germany", "Netherlands", "Poland", "United Kingdom", "Other",
];

export default function RFQForm({ subject }: { subject?: string }) {
  const [formData, setFormData] = useState<FormData>({
    ...initialData,
    lookingFor: subject === "production-equipment" ? "Production equipment inquiry" : "",
  });
  const [state, setState] = useState<FormState>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const mountedAt = useRef(Date.now());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
      payload.append("elapsedMs", String(Date.now() - mountedAt.current));
      if (selectedFile) payload.append("drawing", selectedFile);

      const res = await fetch("/api/rfq", {
        method: "POST",
        body: payload,
      });
      if (res.ok) {
        setState("success");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={28} className="text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-[#0a1628] mb-2">
          Request received
        </h3>
        <p className="text-sm text-[#6b7280] max-w-sm mb-6">
          Thank you, {formData.name.split(" ")[0]}. We will review your request and get back to you within one business day.
        </p>
        <button
        onClick={() => {
          setState("idle");
          setFormData(initialData);
          setFileName(null);
          setSelectedFile(null);
          mountedAt.current = Date.now();
        }}
          className="text-sm text-[#2563eb] hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Personal info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Anna Lindqvist"
            className="w-full px-3 py-2.5 text-sm bg-white border border-[#d1d5db] rounded-lg text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            placeholder="Acme Manufacturing AB"
            className="w-full px-3 py-2.5 text-sm bg-white border border-[#d1d5db] rounded-lg text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="anna@acme.se"
            className="w-full px-3 py-2.5 text-sm bg-white border border-[#d1d5db] rounded-lg text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+46 70 000 00 00"
            className="w-full px-3 py-2.5 text-sm bg-white border border-[#d1d5db] rounded-lg text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2.5 text-sm bg-white border border-[#d1d5db] rounded-lg text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
          >
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">
            Part number / product type
          </label>
          <input
            type="text"
            name="partNumber"
            value={formData.partNumber}
            onChange={handleChange}
            placeholder="e.g. DT06-6S or heat shrink 25mm"
            className="w-full px-3 py-2.5 text-sm bg-white border border-[#d1d5db] rounded-lg text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#374151] mb-1.5">
          What are you looking for? <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="lookingFor"
          value={formData.lookingFor}
          onChange={handleChange}
          required
          placeholder="e.g. Sealed connectors for agricultural equipment"
          className="w-full px-3 py-2.5 text-sm bg-white border border-[#d1d5db] rounded-lg text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#374151] mb-1.5">
          Message / additional details
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder="Application details, quantity, required standards, lead time expectations, or any other relevant information…"
          className="w-full px-3 py-2.5 text-sm bg-white border border-[#d1d5db] rounded-lg text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent resize-none"
        />
      </div>

      {/* File upload */}
      <div>
        <label className="block text-xs font-medium text-[#374151] mb-1.5">
          Drawing / specification (optional)
        </label>
        <label className="flex items-center gap-3 px-4 py-3 bg-[#f8fafc] border border-dashed border-[#d1d5db] rounded-lg cursor-pointer hover:border-[#2563eb] hover:bg-[#eff6ff] transition-colors group">
          <Upload size={16} className="text-[#9ca3af] group-hover:text-[#2563eb] transition-colors" />
          <span className="text-xs text-[#6b7280] group-hover:text-[#2563eb] transition-colors">
            {fileName ? fileName : "Upload PDF, DWG, or image, max 10MB"}
          </span>
          <input
            type="file"
            name="drawing"
            className="sr-only"
            accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setSelectedFile(file);
              setFileName(file?.name ?? null);
            }}
          />
        </label>
      </div>

      {state === "error" && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          Something went wrong. Please try again or email us directly at info@adcontact.se
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        {state === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending request…
          </>
        ) : (
          <>
            <Send size={16} />
            Send request
          </>
        )}
      </button>

      <p className="text-[10px] text-[#9ca3af] text-center">
        By submitting this form you agree to our privacy policy. We do not share your information with third parties.
      </p>
    </form>
  );
}
