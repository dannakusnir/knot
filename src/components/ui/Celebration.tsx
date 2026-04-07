"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface CelebrationProps {
  trigger: boolean;
  title?: string;
  subtitle?: string;
}

function KnotIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
      <path
        d="M32 10c-8 0-14 6-14 14 0 4.8 2.4 9.2 6 12l8 8 8-8c3.6-2.8 6-7.2 6-12 0-8-6-14-14-14z"
        stroke="#6B8F71"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#6B8F71"
        fillOpacity="0.15"
      />
      <path
        d="M32 54c8 0 14-6 14-14 0-4.8-2.4-9.2-6-12l-8-8-8 8c-3.6 2.8-6 7.2-6 12 0 8 6 14 14 14z"
        stroke="#4ECDC4"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#4ECDC4"
        fillOpacity="0.15"
      />
    </svg>
  );
}

export default function Celebration({
  trigger,
  title = "Knot Complete!",
  subtitle = "Amazing work!",
}: CelebrationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setVisible(true);

    const colors = ["#6B8F71", "#4ECDC4", "#FFB347", "#FF6B6B", "#A78BFA", "#DDBEA9"];

    // One big burst
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors,
    });

    // Two side cannons
    setTimeout(() => {
      confetti({ particleCount: 30, angle: 60, spread: 50, origin: { x: 0, y: 0.7 }, colors });
      confetti({ particleCount: 30, angle: 120, spread: 50, origin: { x: 1, y: 0.7 }, colors });
    }, 200);

    const timer = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
      <div className="animate-bounce-in text-center">
        <div className="flex justify-center mb-3">
          <KnotIcon />
        </div>
        <h2 className="text-2xl font-serif font-medium text-[#3D3229]">
          {title}
        </h2>
        <p className="text-base text-[#8A8078] mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
