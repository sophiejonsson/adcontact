"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { toNoCookieEmbed } from "@/lib/consent";
import { useConsent } from "@/lib/useConsent";

/**
 * A YouTube (or other) embed that doesn't load until the visitor has accepted
 * cookies ("Accept all") or explicitly clicks to load this specific video.
 * Uses the youtube-nocookie domain. Fills its (already positioned) container.
 */
export default function ConsentedVideo({ src, title }: { src: string; title: string }) {
  const consent = useConsent();
  const [loaded, setLoaded] = useState(false);

  if (consent === "all" || loaded) {
    return (
      <iframe
        src={toNoCookieEmbed(src)}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-2 bg-[#0f2042] p-4 text-center text-white transition-colors hover:bg-[#132a54]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb]/90">
        <Play size={20} className="ml-0.5" />
      </span>
      <span className="text-sm font-semibold">Load video</span>
      <span className="max-w-xs text-[11px] leading-4 text-[#94a3b8]">
        This embeds YouTube, which sets cookies. Click to load it.
      </span>
    </button>
  );
}
