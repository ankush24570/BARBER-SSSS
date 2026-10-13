"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem, SectionHeading } from "./reveal";
import { EXPRESS_BENEFITS, EXPRESS_FEE, formatPrice } from "@/lib/constants";
import { chooseExpressAndScroll } from "@/lib/booking-store";

export function Express() {
  return (
    <section id="express" className="relative overflow-hidden py-24 sm:py-28">
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-[120px]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        {/* Copy + benefits */}
        <div className="flex flex-col items-start gap-6">
          <SectionHeading
            align="left"
            kicker="The Special Booking"
            title="EXPRESS PRIORITY PASS"
            subtitle="In a rush? The Express Pass is our special fast-track booking with an extra charge — and it rewrites the rules: reserved chairs, zero queue, record time."
          />

          <Reveal delay={0.1}>
            <div className="shimmer relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-primary/40 bg-primary/12 px-5 py-3">
              <Zap className="h-6 w-6 fill-primary text-primary" aria-hidden />
              <span className="text-sm text-muted-foreground">Priority upgrade</span>
              <span className="font-display text-2xl tracking-wider text-primary">
                +{formatPrice(EXPRESS_FEE)}
              </span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                per visit
              </span>
            </div>
          </Reveal>

          <RevealGroup className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            {EXPRESS_BENEFITS.map((b) => (
              <RevealItem key={b.title}>
                <div className="flex h-full gap-3 rounded-xl border border-border/60 bg-card/70 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{b.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {b.desc}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.15}>
            <Button
              onClick={chooseExpressAndScroll}
              size="lg"
              className="group h-14 rounded-2xl bg-primary px-8 text-base font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-[1.03]"
            >
              <Zap className="h-5 w-5 fill-primary-foreground transition-transform duration-300 group-hover:scale-125" aria-hidden />
              Book Express Now
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Button>
          </Reveal>
        </div>

        {/* Visual card */}
        <Reveal delay={0.1}>
          <motion.div
            whileHover={{ rotate: 0, scale: 1.02 }}
            initial={{ rotate: 2.5 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="overflow-hidden rounded-3xl border border-primary/30 bg-card shadow-2xl shadow-black/50">
              <div className="relative">
                <img
                  src="/images/express.png"
                  alt="Barber working at speed with clippers under dramatic amber light"
                  className="h-60 w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <motion.div
                  className="absolute right-4 top-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/40"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                >
                  <Zap className="h-7 w-7 fill-primary-foreground" />
                </motion.div>
              </div>

              <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-3xl tracking-wider text-foreground">
                    PRIORITY BOARDING
                  </h3>
                  <span className="rounded-full border border-primary/40 bg-primary/12 px-3 py-1 font-display text-lg text-primary">
                    +{formatPrice(EXPRESS_FEE)}
                  </span>
                </div>

                {/* queue visual */}
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-4">
                  <div className="flex -space-x-2" aria-hidden>
                    {["#8a6d3d", "#6b5638", "#4e4030"].map((c, i) => (
                      <motion.span
                        key={c}
                        className="grid h-9 w-9 place-items-center rounded-full border-2 border-card text-[10px] font-bold text-foreground/80"
                        style={{ backgroundColor: c }}
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25 }}
                      >
                        {["W", "A", "T"][i]}
                      </motion.span>
                    ))}
                  </div>
                  <div className="h-px flex-1 border-t border-dashed border-border" />
                  <motion.div
                    className="flex items-center gap-2 rounded-lg bg-primary/15 px-3 py-1.5 ring-1 ring-primary/40"
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    <Zap className="h-4 w-4 fill-primary text-primary" aria-hidden />
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      You · first
                    </span>
                  </motion.div>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  While walk-ins wait in line, Express members are seated
                  immediately in a reserved priority chair — even when the shop
                  is fully booked.
                </p>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
