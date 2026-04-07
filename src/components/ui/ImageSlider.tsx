"use client";

import { useState, useCallback, TouchEvent } from "react";
import Image from "next/image";

interface ImageSliderProps {
  images: string[];
  alt: string;
  aspectRatio?: string;
}

export default function ImageSlider({
  images,
  alt,
  aspectRatio = "aspect-[3/2]",
}: ImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const distance = touchStart - touchEnd;
    const minSwipe = 50;

    if (distance > minSwipe && current < images.length - 1) {
      setCurrent((prev) => prev + 1);
    } else if (distance < -minSwipe && current > 0) {
      setCurrent((prev) => prev - 1);
    }
  }, [touchStart, touchEnd, current, images.length]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className={`relative ${aspectRatio} overflow-hidden`}>
        <Image
          src={images[0]}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 500px"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative ${aspectRatio} overflow-hidden`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Images */}
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={src} className="relative w-full h-full shrink-0">
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === current
                ? "bg-white w-4"
                : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
