"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Brush,
  Clock,
  Crown,
  Droplets,
  Flame,
  Flower2,
  Gem,
  Hand,
  Scissors,
  Slice,
  Smile,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RevealGroup,
  RevealItem,
  SectionHeading,
} from "./reveal";
import { formatPrice } from "@/lib/constants";
import { chooseServiceAndScroll, useBookingStore } from "@/lib/booking-store";

const ICONS: Record<string, LucideIcon> = {
  scissors: Scissors,
  zap: Zap,
  slice: Slice,
  flame: Flame,
  crown: Crown,
  smile: Smile,
  sparkles: Sparkles,
  droplets: Droplets,
  gem: Gem,
  hand: Hand,
  flower: Flower2,
  brush: Brush,
};

export function Services() {
  const services = useBookingStore((s) => s.services);

  return (
    <section id="services" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
      <SectionHeading
        kicker="The Menu"
        title="CRAFTED TO PERFECTION"
        subtitle="Barber chair and beauty parlor under one roof. Every service starts with a consultation and ends with a finish that holds — pick one and choose your time in the booking bar below."
      />

      <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = ICONS[service.icon] ?? Scissors;
          return (
            <RevealItem key={service.id}>
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-md shadow-black/20 transition-colors duration-300 hover:border-primary/50"
              >
                {/* hover glow */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="h-5.5 w-5.5" aria-hidden />
                  </span>
                  {service.popular ? (
                    <Badge className="border-primary/40 bg-primary/15 text-primary hover:bg-primary/15">
                      Most Wanted
                    </Badge>
                  ) : null}
                </div>

                <h3 className="mt-5 font-display text-2xl tracking-wide text-foreground">
                  {service.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-3xl text-primary">
                      {formatPrice(service.price)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {service.duration} min
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => chooseServiceAndScroll(service.id)}
                    className="gap-1.5 rounded-lg text-sm font-semibold text-primary transition-all hover:bg-primary/12 hover:gap-2.5"
                    aria-label={`Book ${service.name}`}
                  >
                    Book
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </motion.article>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
