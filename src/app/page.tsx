import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { KnotLogo } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[color:var(--cream)]">
      {/* Top nav */}
      <div className="flex items-center justify-between px-6 pt-14 pb-4">
        <KnotLogo variant="mark" size="sm" />
        <Link
          href="/login"
          className="font-sans text-[12px] font-semibold text-[color:var(--ink)] tracking-wide"
        >
          Sign in
        </Link>
      </div>

      {/* Hero photo card */}
      <section className="px-6 pt-2 relative">
        <div className="relative rounded-[22px] overflow-hidden aspect-[4/5] max-w-md mx-auto">
          <Image
            src="/images/mami/0V8A4710.jpg"
            alt="Mami Cresskill — coffee & pastries"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 from-55% to-black/55" />

          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <span className="font-mono text-[9px] font-bold tracking-[0.22em] text-white/95">
              № 001 · BARISTA BAR · CRESSKILL
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white/95">
            <span className="font-serif italic text-[13px]">
              The morning rush, captured.
            </span>
            <span className="font-mono text-[9px] font-bold tracking-[0.18em]">
              MMXXVI
            </span>
          </div>
        </div>
      </section>

      {/* Headline card — overlapping feel */}
      <section className="px-6 -mt-8 relative">
        <div className="max-w-md mx-auto rounded-[20px] bg-[color:var(--paper)] border border-[color:var(--line)] px-6 py-6">
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--sage-deep)]">
            FOR CREATORS
          </span>
          <h1 className="mt-2 font-serif italic text-[44px] sm:text-[52px] font-normal leading-[0.95] tracking-[-0.02em] text-[color:var(--ink)]">
            Make good<br />
            work. Get fed.
          </h1>
          <p className="mt-3 text-[14px] leading-[1.55] text-[color:var(--ink-mid)] font-medium">
            Real places in your neighborhood are trading{" "}
            <em className="font-serif italic text-[color:var(--sage-deep)] font-normal">
              meals, services and goods
            </em>{" "}
            for honest posts.
          </p>
        </div>
      </section>

      {/* CTAs */}
      <section className="px-6 pt-8 pb-4 max-w-md mx-auto">
        <Link
          href="/signup"
          className="flex items-center justify-center gap-2 w-full h-14 rounded-full bg-[color:var(--sage)] text-white font-semibold tracking-[0.12em] text-[13px] uppercase transition-all hover:bg-[color:var(--sage-deep)] active:scale-[0.98]"
        >
          Create a profile
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-4 text-center text-[13px] text-[color:var(--ink-mid)] font-medium">
          Already here?{" "}
          <Link
            href="/login"
            className="text-[color:var(--ink)] font-bold underline underline-offset-[3px]"
          >
            Sign in
          </Link>
        </p>
      </section>

      {/* How it works — editorial list */}
      <section className="px-6 py-16 max-w-md mx-auto">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--clay-deep)]">
          HOW IT WORKS
        </span>
        <h2 className="mt-3 font-serif italic text-[36px] font-normal leading-[1] tracking-[-0.015em] text-[color:var(--ink)]">
          A knot,<br />
          tied in five.
        </h2>

        <ol className="mt-8 border-t border-[color:var(--line)]">
          {[
            { num: "01", title: "Find a place", desc: "Browse offers from real spots near you." },
            { num: "02", title: "Apply in a tap", desc: "Tell them why you're a fit." },
            { num: "03", title: "Tie the knot", desc: "Visit, eat, shoot." },
            { num: "04", title: "Deliver", desc: "Post the content, tag them, done." },
            { num: "05", title: "Build trust", desc: "Every knot grows your rep." },
          ].map((s) => (
            <li
              key={s.num}
              className="grid grid-cols-[auto_1fr] gap-5 py-5 border-b border-[color:var(--line)]"
            >
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[color:var(--sage-deep)] pt-1.5">
                § {s.num}
              </span>
              <div>
                <h3 className="font-serif text-[19px] font-semibold leading-[1.2] text-[color:var(--ink)]">
                  {s.title}
                </h3>
                <p className="mt-1 text-[13px] text-[color:var(--ink-mid)] leading-[1.5]">
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Pull quote */}
      <section className="px-6 pb-16 max-w-md mx-auto">
        <blockquote>
          <p className="font-serif italic text-[22px] font-normal leading-[1.4] text-[color:var(--ink)]">
            &ldquo;We opened in March. Mom&apos;s still in the kitchen. Come eat, shoot honest, tell the block.&rdquo;
          </p>
          <footer className="mt-3 font-mono text-[9.5px] font-bold tracking-[0.18em] text-[color:var(--ink-soft)]">
            — JIWOO, OWNER · MAMI
          </footer>
        </blockquote>
      </section>

      {/* Second photo card */}
      <section className="px-6 pb-16">
        <div className="relative rounded-[22px] overflow-hidden aspect-[5/6] max-w-md mx-auto">
          <Image
            src="/images/shawarma/0V8A0553.jpg"
            alt="Shawarma Delight"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
          <div className="absolute top-4 left-4 right-4 flex justify-between text-white/95">
            <span className="font-mono text-[9px] font-bold tracking-[0.22em]">
              № 002 · SHAWARMA · SPRING VALLEY
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="font-serif italic text-[18px]">
              Your first knot is waiting.
            </span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-24 max-w-md mx-auto">
        <Link
          href="/signup"
          className="flex items-center justify-center gap-2 w-full h-14 rounded-full bg-[color:var(--ink)] text-[color:var(--cream)] font-semibold tracking-[0.12em] text-[13px] uppercase transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Pull up a chair
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Bottom ticker */}
      <footer className="flex items-center justify-between px-6 pb-10 pt-4 border-t border-[color:var(--line)]">
        <span className="font-mono text-[9px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          EST. 2026 · NJ·NY
        </span>
        <span className="font-mono text-[9px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          217 ONLINE
        </span>
      </footer>
    </div>
  );
}
