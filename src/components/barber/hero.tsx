"use client";

import { motion } from "framer-motion";
import { ChevronDown, MapPin, Sparkles, Star } from "lucide-react";
import { BarberPole } from "./barber-pole";
import { Button } from "@/components/ui/button";
import { OPENING_HOURS_LABEL, SHOP_NAME, SHOP_TAGLINE } from "@/lib/constants";

const HEADLINE = ["SHARP", "LOOKS,", "ZERO", "WAIT."];

const STATS = [
  { value: "12k+", label: "Cuts Delivered" },
  { value: "4.9", label: "Google Rating", star: true },
  { value: "6", label: "Master Barbers" },
  { value: "5min", label: "Express Start", spark: true },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};

const wordAnim = {
  hidden: { opacity: 0, y: 60, rotateX: -40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section
      id="top"
      className="grain relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.png"
          alt="Inside the Fade & Blade barbershop — leather chairs under warm Edison bulbs"
          className="h-full w-full scale-105 object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </div>

      {/* Floating ornaments */}
      <motion.div
        className="absolute right-[12%] top-[18%] hidden text-primary/25 lg:block"
        style={{ "--float-rot": "12deg" } as React.CSSProperties}
        animate={{ y: [0, -16, 0], rotate: [12, 18, 12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-10 w-10" aria-hidden />
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1fr_auto]">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start gap-7"
        >
          <motion.div
            variants={wordAnim}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary backdrop-blur-sm"
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            Downtown · {OPENING_HOURS_LABEL}
          </motion.div>

          <h1
            className="font-display text-[17vw] leading-[0.92] tracking-wide text-foreground sm:text-7xl lg:text-8xl"
            style={{ perspective: "600px" }}
          >
            {HEADLINE.slice(0, 2).map((w) => (
              <motion.span key={w} variants={wordAnim} className="mr-3 inline-block">
                {w}
              </motion.span>
            ))}
            <br />
            {HEADLINE.slice(2).map((w, i) => (
              <motion.span
                key={w}
                variants={wordAnim}
                className={`mr-3 inline-block ${i === 1 ? "text-primary" : ""}`}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            variants={wordAnim}
            className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {SHOP_NAME} is a modern take on the classic neighborhood shop —
            precision cuts, beard sculpting and hot towel rituals from barbers
            who treat it like craft. Book your slot online, or grab an{" "}
            <a
              href="#express"
              className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
            >
              Express Priority Pass
            </a>{" "}
            and walk straight into the chair.
          </motion.p>

          <motion.div variants={wordAnim} className="flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="glow-pulse h-14 rounded-2xl bg-primary px-8 text-base font-bold uppercase tracking-widest text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
            >
              <a href="#book">Book Your Chair</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-2xl border-primary/40 bg-transparent px-7 text-base font-semibold text-primary backdrop-blur-sm transition-colors hover:bg-primary/10"
            >
              <a href="#express">Express Pass — skip the line</a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.dl
            variants={wordAnim}
            className="mt-4 grid w-full max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-4"
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 bg-background/70 px-3 py-4 backdrop-blur-md"
              >
                <dt className="order-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="order-1 flex items-center gap-1 font-display text-2xl tracking-wider text-primary">
                  {s.value}
                  {s.star ? <Star className="h-4 w-4 fill-primary text-primary" aria-hidden /> : null}
                  {s.spark ? <Sparkles className="h-4 w-4" aria-hidden /> : null}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Barber pole */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden flex-col items-center gap-4 lg:flex"
        >
          <BarberPole />
          <span className="font-display text-sm tracking-[0.3em] text-muted-foreground">
            {SHOP_TAGLINE}
          </span>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#services"
        aria-label="Scroll to services"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full p-2 text-muted-foreground transition-colors hover:text-primary"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6" aria-hidden />
      </motion.a>
    </section>
  );
}
