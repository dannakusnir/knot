import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#EDE8E2]">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-dvh px-8">
        {/* Knot icon */}
        <svg
          viewBox="0 0 64 64"
          fill="none"
          className="h-12 w-12 mb-10 opacity-60"
        >
          <path
            d="M32 10c-8 0-14 6-14 14 0 4.8 2.4 9.2 6 12l8 8 8-8c3.6-2.8 6-7.2 6-12 0-8-6-14-14-14z"
            stroke="#A5A58D"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 54c8 0 14-6 14-14 0-4.8-2.4-9.2-6-12l-8-8-8 8c-3.6 2.8-6 7.2-6 12 0 8 6 14 14 14z"
            stroke="#A5A58D"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <h1 className="text-5xl sm:text-6xl font-serif font-medium leading-[1.1] text-center text-[#4A4540] max-w-lg">
          Collaborations that feel like{" "}
          <span className="italic text-[#8B9B74]">connections</span>.
        </h1>

        <p className="text-xl text-[#7A7570] mt-7 text-center max-w-[340px] leading-relaxed">
          Where local businesses and content creators build real partnerships.
        </p>

        <Link
          href="/signup"
          className="mt-14 flex items-center justify-center w-full max-w-[300px] h-14 rounded-full bg-[#A5A58D] text-white text-base tracking-[0.06em] uppercase transition-all hover:bg-[#8E8E78] active:scale-[0.98]"
        >
          Get Started
        </Link>

        <Link
          href="/login"
          className="mt-4 text-base text-[#A09890] tracking-wide hover:text-[#6B705C] transition-colors"
        >
          I already have an account
        </Link>
      </section>

      {/* Photo grid — symmetric 3 columns */}
      <section className="px-4 pb-6">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-2.5">
          <div className="rounded-[1.75rem] overflow-hidden aspect-[3/4]">
            <Image
              src="/images/mami/TUBEAV-8-14-27.jpg"
              alt="Mami Cresskill"
              width={500}
              height={666}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-[1.75rem] overflow-hidden aspect-[3/4]">
            <Image
              src="/images/shawarma/0V8A0553.jpg"
              alt="Shawarma Delight"
              width={500}
              height={666}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-[1.75rem] overflow-hidden aspect-[3/4]">
            <Image
              src="/images/livela/0V8A0885.jpg"
              alt="Livela Beauty"
              width={500}
              height={666}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-[#DDBEA9]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#DDBEA9]" />
          <div className="w-8 h-px bg-[#DDBEA9]" />
        </div>
      </div>

      {/* What is KNOT */}
      <section className="px-8 py-8 max-w-md mx-auto text-center">
        <p className="text-base tracking-[0.3em] uppercase text-[#A5A58D] font-medium mb-6">
          What is KNOT
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif font-medium leading-[1.3] text-[#4A4540]">
          A structured system for real collaborations between businesses and creators.
        </h2>
      </section>

      {/* Steps */}
      <section className="px-6 py-10">
        <div className="max-w-sm mx-auto space-y-3">
          {[
            { num: "01", title: "Discovery", desc: "Browse local offers from verified businesses near you." },
            { num: "02", title: "Create Knot", desc: "Found a match? Apply with your pitch." },
            { num: "03", title: "Connect", desc: "Business approves. The collaboration begins." },
            { num: "04", title: "Deliver", desc: "Create content. Upload proof. Content goes live." },
            { num: "05", title: "Trust", desc: "Both sides rate. Your reputation grows with every Knot." },
          ].map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl bg-[#F7F4F0] px-5 py-5"
            >
              <div className="shrink-0 w-9 h-9 rounded-full bg-[#DDBEA9]/30 flex items-center justify-center mt-0.5">
                <span className="text-sm font-bold text-[#CB997E]">
                  {step.num}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#4A4540]">{step.title}</h3>
                <p className="text-base text-[#7A7570] mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full photo */}
      <section className="px-4 py-6">
        <div className="max-w-lg mx-auto rounded-[1.75rem] overflow-hidden aspect-[16/10]">
          <Image
            src="/images/mami/Mami-vibes-9-28-25-69.jpg"
            alt="Mami Cresskill food spread"
            width={1200}
            height={750}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Statement — olive green */}
      <section className="px-6 py-10">
        <div className="max-w-sm mx-auto rounded-[1.75rem] bg-[#6B705C] px-8 py-12 text-center">
          <p className="text-base text-[#DDBEA9] tracking-[0.2em] uppercase mb-5">
            Built on trust
          </p>
          <p className="text-2xl font-serif font-medium leading-[1.4] text-[#EDE8E2]">
            Every creator is vetted.
            Every collaboration is tracked.
            Trust is earned.
          </p>
        </div>
      </section>

      {/* For who */}
      <section className="px-4 py-12">
        <div className="max-w-sm mx-auto grid grid-cols-2 gap-3">
          <div className="rounded-[1.75rem] overflow-hidden bg-[#F7F4F0]">
            <div className="aspect-[1/1] overflow-hidden">
              <Image
                src="/images/shawarma/0V8A0364.jpg"
                alt="Shawarma Delight interior"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <p className="text-sm text-[#CB997E] font-semibold tracking-[0.15em] uppercase mb-2">
                For Businesses
              </p>
              <p className="text-base font-semibold text-[#4A4540] leading-snug">
                Real content from trusted local creators.
              </p>
            </div>
          </div>

          <div className="rounded-[1.75rem] overflow-hidden bg-[#F7F4F0]">
            <div className="aspect-[1/1] overflow-hidden">
              <Image
                src="/images/livela/0V8A0874.jpg"
                alt="Livela Spa"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <p className="text-sm text-[#A5A58D] font-semibold tracking-[0.15em] uppercase mb-2">
                For Creators
              </p>
              <p className="text-base font-semibold text-[#4A4540] leading-snug">
                Real opportunities. Build your portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-20 text-center">
        <h3 className="text-3xl sm:text-4xl font-serif font-medium leading-[1.25] text-[#4A4540] mb-8">
          Your first Knot<br />is waiting.
        </h3>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center h-14 rounded-full bg-[#A5A58D] text-white text-base tracking-[0.06em] uppercase px-10 transition-all hover:bg-[#8E8E78] active:scale-[0.98]"
        >
          Create your account
          <ArrowRight className="h-5 w-5 ml-2" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center">
        <p className="text-base tracking-[0.3em] uppercase text-[#C4BBB2]">
          KNOT
        </p>
      </footer>
    </div>
  );
}
