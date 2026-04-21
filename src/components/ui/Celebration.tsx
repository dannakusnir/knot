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
        stroke="var(--sage-deep)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="var(--sage-tint)"
      />
      <path
        d="M32 54c8 0 14-6 14-14 0-4.8-2.4-9.2-6-12l-8-8-8 8c-3.6 2.8-6 7.2-6 12 0 8 6 14 14 14z"
        stroke="var(--clay-deep)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="var(--clay-soft)"
      />
    </svg>
  );
}

export default function Celebration({
  trigger,
  title = "Knot tied.",
  subtitle = "Beautiful work.",
}: CelebrationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setVisible(true);

    // Confetti in the KNOT palette — sage, clay, sand, cream
    const colors = ["#6B8F71", "#4C6B54", "#CB997E", "#9F6B4E", "#DFD8CC", "#F5E4D7"];

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
        <div className="flex justify-center mb-4">
          <KnotIcon />
        </div>
        <h2 className="font-serif italic text-[30px] font-medium text-[color:var(--ink)] tracking-[-0.015em]">
          {title}
        </h2>
        <p className="font-serif italic text-[15px] text-[color:var(--sage-deep)] mt-1.5">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
