"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-[#e5eaf0] bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#f8fafc_72%)]" />
        <Image
          src={selectedImage}
          alt={name}
          fill
          className="object-contain p-8 sm:p-12"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          unoptimized
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((image, index) => (
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
