"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Armchair,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  RotateCcw,
  Scissors,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXPRESS_BENEFITS, EXPRESS_FEE, formatPrice } from "@/lib/constants";
import type { BookingResult, ServiceDto } from "@/lib/types";
import { slotLabel } from "@/lib/slots";

/* ---------------------------------- helpers --------------------------------- */

export function dayChipLabel(date: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date + "T00:00:00");
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tmrw";
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export function dayNum(date: string): string {
  return new Date(date + "T00:00:00").getDate().toString();
}

export function formatLongDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/* --------------------------------- step dots -------------------------------- */

const STEPS = [
  { n: 1, label: "Service", icon: Scissors },
  { n: 2, label: "Time", icon: CalendarDays },
  { n: 3, label: "Details", icon: Check },
] as const;

export function StepDots({
  step,
  onStepClick,
}: {
  step: 1 | 2 | 3;
  onStepClick: (n: 1 | 2 | 3) => void;
}) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Booking progress">
      {STEPS.map((s, i) => {
        const active = step === s.n;
        const done = step > s.n;
        const Icon = s.icon;
        return (
          <li key={s.n} className="flex flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                if (s.n < step) onStepClick(s.n);
              }}
              disabled={s.n >= step}
              className={`flex min-h-11 flex-1 items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-all duration-300 sm:flex-none sm:min-w-[130px] ${
                active
                  ? "border-primary/60 bg-primary/12 text-primary shadow-md shadow-primary/10"
                  : done
                    ? "cursor-pointer border-primary/30 bg-primary/[0.06] text-primary/80 hover:bg-primary/12"
                    : "border-border/60 bg-card/50 text-muted-foreground"
              }`}
              aria-current={active ? "step" : undefined}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                  active || done
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : s.n}
              </span>
              <span className="hidden text-sm font-semibold sm:block">{s.label}</span>
              <span className="text-sm font-semibold sm:hidden">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
            </button>
            {i < STEPS.length - 1 ? (
              <motion.span
                aria-hidden
                className="hidden h-px w-6 bg-border sm:block"
                animate={{ opacity: step > s.n ? 1 : 0.4 }}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------- express toggle ------------------------------ */

export function ExpressToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Express Priority Pass"
      onClick={() => onChange(!checked)}
      whileTap={{ scale: 0.99 }}
      className={`relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
        checked
          ? "glow-pulse border-primary/60 bg-primary/12"
          : "border-border/70 bg-card/60 hover:border-primary/40"
      }`}
    >
      <div className="flex items-center gap-3.5">
        <motion.span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${
            checked ? "bg-primary text-primary-foreground" : "bg-primary/15 text-primary"
          }`}
          animate={checked ? { rotate: [0, -10, 10, 0] } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
          aria-hidden
        >
          <Zap className={`h-5.5 w-5.5 ${checked ? "fill-primary-foreground" : ""}`} />
        </motion.span>

        <span className="flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground">Express Priority Pass</span>
            <span className="rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
              +{formatPrice(EXPRESS_FEE)}
            </span>
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Reserved chair · zero wait · guaranteed start in 5 minutes
          </span>
        </span>

        {/* switch */}
        <span
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
            checked ? "bg-primary" : "bg-muted"
          }`}
          aria-hidden
        >
          <motion.span
            className="absolute top-1 h-5 w-5 rounded-full bg-background shadow"
            animate={{ left: checked ? 26 : 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </span>
      </div>

      <AnimatePresence initial={false}>
        {checked ? (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid grid-cols-1 gap-1.5 border-t border-primary/25 pt-3 sm:grid-cols-2">
              {EXPRESS_BENEFITS.map((b) => (
                <li key={b.title} className="flex items-center gap-2 text-xs text-foreground/85">
                  <Zap className="h-3 w-3 shrink-0 fill-primary text-primary" aria-hidden />
                  {b.title}
                </li>
              ))}
            </div>
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}

/* -------------------------------- summary card ------------------------------- */

export function SummaryPanel({
  service,
  date,
  slot,
  isExpress,
}: {
  service: ServiceDto | null;
  date: string;
  slot: string | null;
  isExpress: boolean;
}) {
  const total = (service?.price ?? 0) + (isExpress ? EXPRESS_FEE : 0);
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-lg shadow-black/20">
      <h3 className="font-display text-xl tracking-wider text-foreground">YOUR TICKET</h3>

      <ul className="mt-4 flex flex-col gap-3 text-sm">
        <li className="flex items-start gap-3">
          <Armchair className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          {service ? (
            <span className="text-foreground">
              {service.name}
              <span className="block text-xs text-muted-foreground">
                {service.duration} min · {formatPrice(service.price)}
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">No service selected yet</span>
          )}
        </li>
        <li className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span className="text-foreground">
            {formatLongDate(date)}
            <span className="block text-xs text-muted-foreground">
              {slot ? `Arrive by ${slotLabel(slot)}` : "Pick a time slot"}
            </span>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span className="text-foreground">
            {slot ? slotLabel(slot) : "—"}
            <span className="block text-xs text-muted-foreground">
              {isExpress ? "Priority chair · 5-min start" : "Standard chair"}
            </span>
          </span>
        </li>
      </ul>

      <div className="mt-4 border-t border-border/60 pt-4">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={total}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-end justify-between"
          >
            <span className="text-sm text-muted-foreground">Total at counter</span>
            <span className="font-display text-4xl tracking-wider text-primary">
              {formatPrice(total)}
            </span>
          </motion.div>
        </AnimatePresence>
        <div className="mt-1 flex flex-col gap-0.5 text-right text-xs text-muted-foreground">
          <span>{service ? `Service ${formatPrice(service.price)}` : "Service —"}</span>
          {isExpress ? (
            <span className="font-semibold text-primary">
              Express Pass +{formatPrice(EXPRESS_FEE)}
            </span>
          ) : null}
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-xl bg-background/60 p-3 text-xs leading-relaxed text-muted-foreground">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
        Free cancellation up to 2 hours before your slot. Pay at the shop — card,
        cash or wallet.
      </p>
    </div>
  );
}

/* -------------------------------- success screen ----------------------------- */

const CONFETTI_COLORS = ["#d9a441", "#b3372e", "#f2ece1", "#8a6d3d"];

export function SuccessScreen({
  booking,
  onReset,
}: {
  booking: BookingResult;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl border border-primary/30 bg-card px-6 py-12 text-center shadow-2xl shadow-black/30"
    >
      {/* confetti burst */}
      <div className="pointer-events-none absolute left-1/2 top-16" aria-hidden>
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const dist = 80 + (i % 4) * 22;
          return (
            <motion.span
              key={i}
              className="absolute h-2 w-2 rounded-sm"
              style={{ backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length] }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              animate={{
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist + 30,
                opacity: 0,
                scale: 0.3,
                rotate: 180,
              }}
              transition={{ duration: 1.3, delay: 0.4, ease: "easeOut" }}
            />
          );
        })}
      </div>

      {/* animated check */}
      <div className="relative">
        <motion.svg viewBox="0 0 52 52" className="h-20 w-20" aria-hidden>
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            fill="none"
            stroke="#d9a441"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <motion.path
            d="M15 27 l7.5 7.5 L37 19"
            fill="none"
            stroke="#d9a441"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
          />
        </motion.svg>
      </div>

      <div>
        <h3 className="font-display text-4xl tracking-wide text-foreground">
          YOU&apos;RE BOOKED IN
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {booking.isExpress
            ? "Priority chair reserved — walk straight in, your barber starts within 5 minutes."
            : "See you soon! Arrive 5 minutes early and check in with your code."}
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-primary/50 bg-primary/[0.07] px-8 py-4">
        <span className="block text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Booking code
        </span>
        <span className="font-mono text-3xl font-bold tracking-[0.2em] text-primary">
          {booking.code}
        </span>
      </div>

      <dl className="grid w-full max-w-md grid-cols-2 gap-3 text-left text-sm">
        <div className="rounded-xl bg-background/60 p-3">
          <dt className="text-xs text-muted-foreground">Service</dt>
          <dd className="mt-0.5 font-medium text-foreground">{booking.service.name}</dd>
        </div>
        <div className="rounded-xl bg-background/60 p-3">
          <dt className="text-xs text-muted-foreground">When</dt>
          <dd className="mt-0.5 font-medium text-foreground">
            {formatLongDate(booking.date)}, {slotLabel(booking.timeSlot)}
          </dd>
        </div>
        <div className="rounded-xl bg-background/60 p-3">
          <dt className="text-xs text-muted-foreground">Type</dt>
          <dd className="mt-0.5 flex items-center gap-1.5 font-medium text-foreground">
            {booking.isExpress ? (
              <>
                <Zap className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden />
                Express Priority
              </>
            ) : (
              "Standard"
            )}
          </dd>
        </div>
        <div className="rounded-xl bg-background/60 p-3">
          <dt className="text-xs text-muted-foreground">Total due</dt>
          <dd className="mt-0.5 font-medium text-primary">
            {formatPrice(booking.totalPrice)}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={onReset}
          variant="outline"
          className="h-12 rounded-xl border-primary/40 px-6 font-semibold text-primary hover:bg-primary/10"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Book another slot
        </Button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BadgeCheck className="h-4 w-4 text-primary" aria-hidden />
          Confirmation sent to {booking.phone}
        </div>
      </div>
    </motion.div>
  );
}
