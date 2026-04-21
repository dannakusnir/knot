import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import LivePulse from "@/components/ui/LivePulse";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[color:var(--background)]">
      {/* Top ribbon — editorial masthead */}
      <div className="border-b border-[color:var(--line)] px-5 py-3 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-ink">
          KN—T
        </span>
        <span className="font-mono text-[9px] tracking-[0.2em] text-[color:var(--ink-soft)] hidden sm:inline">
          CRESSKILL · SPRING VALLEY · NJ·NY · MMXXVI
        </span>
        <LivePulse count={217} label="creators" />
      </div>

      {/* Hero — editorial fullscreen */}
      <section className="min-h-[88vh] px-6 pt-16 pb-20 flex flex-col">
        <SectionEyebrow num="01" label="KNOT · Brand direction" accent />

        <h1 className="mt-6 font-serif font-normal text-[56px] sm:text-[84px] leading-[0.95] tracking-[-0.02em] text-ink">
          Collaborations<br />
          that feel like<br />
          <em className="italic font-medium text-[color:var(--sage-deep)]">
            connections.
          </em>
        </h1>

        <p className="mt-8 font-serif italic text-xl text-[color:var(--ink-mid)] max-w-md leading-relaxed">
          Where local businesses and content creators build real partnerships.
          Warm, trackable, and entirely yours.
        </p>

        <div className="mt-auto pt-16 flex flex-col gap-3">
          <Link
            href="/signup"
            className="flex items-center justify-between w-full max-w-[340px] h-14 rounded-full bg-[color:var(--sage-deep)] text-white px-6 transition-all hover:bg-[color:var(--sage)] active:scale-[0.98]"
          >
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase font-bold">
              Get Started
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--ink-soft)] hover:text-ink transition-colors"
          >
            I already have an account →
          </Link>
        </div>
      </section>

      {/* Editorial photo module */}
      <section className="px-4 pb-6">
        <div className="max-w-3xl mx-auto">
          <div className="border border-[color:var(--line)] p-3 bg-[color:var(--paper)]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/mami/0V8A4710.jpg"
                alt="Mami Cresskill — coffee & pastries"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
            <div className="flex items-center justify-between pt-3">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[color:var(--ink-soft)] uppercase">
                No. 01 · Mami · Cresskill
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-[color:var(--ink-soft)] uppercase">
                Friday · 6:48 AM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* What is KNOT */}
      <section className="px-6 py-24 max-w-2xl mx-auto">
        <SectionEyebrow num="02" label="What is KNOT" accent />
        <h2 className="mt-5 font-serif text-[40px] sm:text-[56px] leading-[1.02] tracking-[-0.015em] text-ink font-normal">
          A structured system for <em className="italic text-[color:var(--sage-deep)]">real</em> collaborations between businesses and creators.
        </h2>
      </section>

      {/* Steps — hairline list */}
      <section className="px-6 pb-20 max-w-xl mx-auto">
        <SectionEyebrow num="03" label="The process" />
        <div className="mt-6 border-t border-[color:var(--line)]">
          {[
            { num: "01", title: "Discover", desc: "Browse local offers from verified businesses near you." },
            { num: "02", title: "Apply", desc: "Found a match? Send your pitch." },
            { num: "03", title: "Connect", desc: "Business approves. The collaboration begins." },
            { num: "04", title: "Deliver", desc: "Create content. Upload proof. Content goes live." },
            { num: "05", title: "Trust", desc: "Both sides rate. Your reputation grows with every Knot." },
          ].map((step) => (
            <div
              key={step.num}
              className="grid grid-cols-[auto_1fr] gap-6 py-6 border-b border-[color:var(--line)]"
            >
              <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-[color:var(--sage-deep)] mt-1.5">
                § {step.num}
              </span>
              <div>
                <h3 className="font-serif text-2xl font-medium text-ink leading-tight">
                  {step.title}
                </h3>
                <p className="text-[15px] text-[color:var(--ink-mid)] mt-1.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full photo */}
      <section className="px-4 pb-6">
        <div className="max-w-3xl mx-auto">
          <div className="border border-[color:var(--line)] p-3 bg-[color:var(--paper)]">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/shawarma/0V8A0553.jpg"
                alt="Shawarma Delight"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
            <div className="flex items-center justify-between pt-3">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[color:var(--ink-soft)] uppercase">
                No. 02 · Shawarma Delight · Spring Valley
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-[color:var(--ink-soft)] uppercase">
                Active Knot
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Statement — warm cream, italic pull quote */}
      <section className="px-6 py-24 max-w-xl mx-auto">
        <SectionEyebrow label="Built on trust" accent />
        <p className="mt-6 font-serif italic text-3xl sm:text-[42px] leading-[1.25] text-ink font-normal">
          Every creator is vetted.<br />
          Every collaboration is tracked.<br />
          <span className="text-[color:var(--sage-deep)]">Trust is earned.</span>
        </p>
      </section>

      {/* For who */}
      <section className="px-4 pb-20">
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-[color:var(--line)] bg-[color:var(--paper)]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/shawarma/0V8A0359.jpg"
                alt="Shawarma Delight"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="p-5">
              <SectionEyebrow num="A" label="For Businesses" accent />
              <p className="mt-3 font-serif text-xl font-medium text-ink leading-snug">
                Real content from trusted local creators.
              </p>
            </div>
          </div>

          <div className="border border-[color:var(--line)] bg-[color:var(--paper)]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/livela/0V8A3289.jpg"
                alt="Livela Beauty"
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="p-5">
              <SectionEyebrow num="B" label="For Creators" accent />
              <p className="mt-3 font-serif text-xl font-medium text-ink leading-snug">
                Real opportunities. Build your portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 text-center border-t border-[color:var(--line)]">
        <SectionEyebrow label="Ready?" accent className="text-center" />
        <h3 className="mt-6 font-serif text-[42px] sm:text-[64px] leading-[0.98] tracking-[-0.02em] text-ink font-normal">
          Your first Knot<br />
          <em className="italic text-[color:var(--sage-deep)]">is waiting.</em>
        </h3>
        <Link
          href="/signup"
          className="mt-10 inline-flex items-center justify-center h-14 rounded-full bg-[color:var(--sage-deep)] text-white px-10 transition-all hover:bg-[color:var(--sage)] active:scale-[0.98] gap-3"
        >
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase font-bold">
            Create your account
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[color:var(--line)] py-8 px-5 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.3em] text-[color:var(--ink-soft)] font-bold">
          K · N · O · T
        </span>
        <LivePulse count={217} label="creators online" />
        <span className="font-mono text-[10px] tracking-[0.2em] text-[color:var(--ink-soft)] hidden sm:inline">
          VOL. 01 · MMXXVI
        </span>
      </footer>
    </div>
  );
}
