"use client";

import Image from "next/image";
import { useState } from "react";
import { Package } from "lucide-react";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  // Drop Magento's "no photo"/placeholder graphics so the clean fallback shows
  // instead of the dated "image coming soon" image.
  const cleanImages = images.filter((img) => img && !/no_photo|placeholder/i.test(img));
  const [selectedImage, setSelectedImage] = useState<string | null>(cleanImages[0] ?? null);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-[#e5eaf0] bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#f8fafc_72%)]" />
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={name}
            fill
            className="object-contain p-8 sm:p-12"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
            <Package size={52} strokeWidth={1.4} className="text-[#cbd5e1]" />
            <span className="text-xs font-medium text-[#94a3b8]">No image available</span>
          </div>
        )}
      </div>

      {cleanImages.length > 1 && (
        <div className="mt-4 flex gap-3">
          {cleanImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedImage(image)}
              aria-label={`View ${name} image ${index + 1}`}
              className={`relative h-20 w-20 overflow-hidden rounded-xl border bg-white transition-all ${
                selectedImage === image
                  ? "border-[#2563eb] ring-2 ring-[#2563eb]/15"
                  : "border-[#e5eaf0] hover:border-[#94a3b8]"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-contain p-2"
                sizes="80px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
