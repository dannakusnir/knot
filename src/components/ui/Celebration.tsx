"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface CelebrationProps {
  trigger: boolean;
  title?: string;
  subtitle?: string;
  emoji?: string;
}

export default function Celebration({
  trigger,
  title = "Knot Complete!",
  subtitle = "Amazing work — you nailed it!",
  emoji = "🎉",
}: CelebrationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setVisible(true);

    // Fire confetti
    const duration = 2500;
    const end = Date.now() + duration;

    const colors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A78BFA", "#FB923C", "#7FC8A9"];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Big burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors,
      });
    }, 300);

    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
      <div className="animate-bounce-in text-center">
        <div className="text-7xl mb-4">{emoji}</div>
        <h2 className="text-3xl font-serif font-medium text-[#3D3229]">
          {title}
        </h2>
        <p className="text-lg text-[#8A8078] mt-2">{subtitle}</p>
      </div>
    </div>
  );
}
