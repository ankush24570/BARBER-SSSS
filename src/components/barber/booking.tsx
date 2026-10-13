"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Loader2,
  RefreshCw,
  Scissors,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "./reveal";
import {
  ExpressToggle,
  StepDots,
  SummaryPanel,
  SuccessScreen,
  dayChipLabel,
  dayNum,
  formatLongDate,
} from "./booking-parts";
import {
  BOOKING_DAYS_AHEAD,
  EXPRESS_FEE,
  formatPrice,
} from "@/lib/constants";
import { toDateKey } from "@/lib/slots";
import type { BookingResult, SlotInfo } from "@/lib/types";
import { useBookingStore } from "@/lib/booking-store";

type Step = 1 | 2 | 3;

const stepVariants = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0 }),
};

export function Booking() {
  const services = useBookingStore((s) => s.services);
  const servicesLoading = useBookingStore((s) => s.servicesLoading);
  const preselectedServiceId = useBookingStore((s) => s.preselectedServiceId);
  const preselectedExpress = useBookingStore((s) => s.preselectedExpress);

  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);

  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<string>(() => toDateKey(new Date()));
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slot, setSlot] = useState<string | null>(null);
  const [isExpress, setIsExpress] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<BookingResult | null>(null);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId) ?? null,
    [services, serviceId]
  );

  /* ------------------------------ availability ------------------------------ */

  const fetchAvailability = useCallback(async (d: string, silent = false) => {
    if (!silent) setSlotsLoading(true);
    try {
      const res = await fetch(`/api/availability?date=${d}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load availability");
      setSlots(data.slots as SlotInfo[]);
    } catch (err) {
      console.error(err);
      if (!silent)
        toast.error("Could not load time slots", {
          description: "Please check your connection and try again.",
        });
    } finally {
      if (!silent) setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability(date);
  }, [date, fetchAvailability]);

  /* ----------------------------- preselections ------------------------------ */

  useEffect(() => {
    if (!preselectedServiceId) return;
    setServiceId(preselectedServiceId);
    useBookingStore.getState().clearPreselection();
    if (step === 1) {
      setDirection(1);
      setStep(2);
    }
  }, [preselectedServiceId]);

  useEffect(() => {
    if (!preselectedExpress) return;
    setIsExpress(true);
    useBookingStore.getState().clearExpressPreselection();
    toast.success("Express Priority Pass armed ⚡", {
      description: `A reserved chair with zero wait — just +$${EXPRESS_FEE} on top of your service.`,
    });
  }, [preselectedExpress]);

  /* --------------------------------- dates ---------------------------------- */

  const days = useMemo(() => {
    const arr: string[] = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < BOOKING_DAYS_AHEAD; i++) {
      arr.push(toDateKey(start));
      start.setDate(start.getDate() + 1);
    }
    return arr;
  }, []);

  /* ------------------------------ slot helpers ------------------------------ */

  const slotSelectable = (s: SlotInfo) =>
    isExpress ? s.expressAvailable : s.regularAvailable;

  const expressOnly = (s: SlotInfo) =>
    !isExpress && !s.regularAvailable && s.expressAvailable;

  function handleSlotClick(s: SlotInfo) {
    if (slotSelectable(s)) {
      setSlot(s.slot);
      return;
    }
    if (expressOnly(s)) {
      toast.info("Standard chairs are full for this slot", {
        description:
          "Express seats are still open — switch on the Priority Pass to lock this time in.",
        action: {
          label: "⚡ Use Express",
          onClick: () => setIsExpress(true),
        },
        duration: 9000,
      });
    }
  }

  function changeExpress(v: boolean) {
    setIsExpress(v);
    if (slot) {
      const info = slots.find((s) => s.slot === slot);
      const stillOk = info && (v ? info.expressAvailable : info.regularAvailable);
      if (!stillOk) {
        setSlot(null);
        toast.info("Time released", {
          description: v
            ? "Express seats were taken for that time — pick another slot."
            : "Standard seats were taken for that time — pick another slot.",
        });
      }
    }
  }

  /* ---------------------------------- flow ---------------------------------- */

  const goTo = (next: Step) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const canContinue =
    step === 1 ? !!serviceId : step === 2 ? !!slot : name.trim().length >= 2 && phone.trim().length >= 7;

  async function submit() {
    if (!selectedService || !slot) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          date,
          timeSlot: slot,
          isExpress,
          customerName: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setBooking(data.booking as BookingResult);
        fetchAvailability(date, true);
        toast.success("Booking confirmed 🎉");
        return;
      }

      if (res.status === 409) {
        const msg: string = data.error || "That slot is no longer available.";
        if (data.code === "SLOT_FULL_TRY_EXPRESS") {
          toast.error("Standard chairs just filled up", {
            description: msg,
            action: {
              label: "⚡ Use Express",
              onClick: () => {
                setIsExpress(true);
                toast.success("Express Pass armed — reserved chairs are kept for priority members.");
              },
            },
            duration: 10000,
          });
        } else {
          toast.error("Slot unavailable", { description: msg });
        }
        fetchAvailability(date, true);
        setSlot(null);
        goTo(2);
        return;
      }

      toast.error(data.error || "Booking failed", {
        description: data.issues?.[0]?.message,
      });
    } catch (err) {
      console.error(err);
      toast.error("Network hiccup", {
        description: "We could not reach the shop. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function resetAll() {
    setBooking(null);
    setStep(1);
    setDirection(1);
    setServiceId(null);
    setSlot(null);
    setIsExpress(false);
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    fetchAvailability(date, true);
  }

  /* --------------------------------- render --------------------------------- */

  return (
    <section id="book" className="relative py-24 sm:py-28">
      <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-primary/[0.06] blur-[100px]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          kicker="Reserve Your Chair"
          title="BOOK YOUR SLOT"
          subtitle="Three quick steps: pick a service, choose your time, lock it in. Standard seats fill fast — the Express Pass always keeps reserved chairs for those in a hurry."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main card */}
          <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-xl shadow-black/25 backdrop-blur-sm sm:p-7">
            {booking ? (
              <SuccessScreen booking={booking} onReset={resetAll} />
            ) : (
              <>
                <StepDots step={step} onStepClick={goTo} />

                <div className="mt-6 min-h-[380px]">
                  <AnimatePresence mode="wait" custom={direction} initial={false}>
                    {/* ------------------------------ STEP 1 ------------------------------ */}
                    {step === 1 ? (
                      <motion.div
                        key="step-1"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        role="radiogroup"
                        aria-label="Choose a service"
                      >
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          <Scissors className="h-4 w-4 text-primary" aria-hidden />
                          What are we doing today?
                        </h3>

                        {servicesLoading ? (
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div
                                key={i}
                                className="h-20 animate-pulse rounded-xl bg-muted/60"
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {services.map((s) => {
                              const active = s.id === serviceId;
                              return (
                                <motion.button
                                  key={s.id}
                                  type="button"
                                  role="radio"
                                  aria-checked={active}
                                  onClick={() => setServiceId(s.id)}
                                  whileTap={{ scale: 0.98 }}
                                  className={`relative flex min-h-11 items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                                    active
                                      ? "border-primary/70 bg-primary/12 shadow-md shadow-primary/10"
                                      : "border-border/60 bg-background/40 hover:border-primary/40 hover:bg-primary/[0.06]"
                                  }`}
                                >
                                  <span className="flex-1">
                                    <span className="flex items-center gap-2 font-semibold text-foreground">
                                      {s.name}
                                      {s.popular ? (
                                        <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                                          Hot
                                        </span>
                                      ) : null}
                                    </span>
                                    <span className="mt-0.5 block text-xs text-muted-foreground">
                                      {s.duration} min · {formatPrice(s.price)}
                                    </span>
                                  </span>
                                  <span
                                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-200 ${
                                      active
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border"
                                    }`}
                                    aria-hidden
                                  >
                                    {active ? <Check className="h-3.5 w-3.5" /> : null}
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        )}
                      </motion.div>
                    ) : null}

                    {/* ------------------------------ STEP 2 ------------------------------ */}
                    {step === 2 ? (
                      <motion.div
                        key="step-2"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
                          Pick a day
                        </h3>

                        {/* date chips */}
                        <div
                          className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]"
                          role="radiogroup"
                          aria-label="Choose a date"
                        >
                          {days.map((d) => {
                            const active = d === date;
                            return (
                              <motion.button
                                key={d}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                onClick={() => {
                                  setDate(d);
                                  setSlot(null);
                                }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex min-h-[64px] w-[72px] shrink-0 flex-col items-center justify-center rounded-xl border transition-all duration-200 ${
                                  active
                                    ? "border-primary/70 bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                    : "border-border/60 bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-primary"
                                }`}
                              >
                                <span className="text-[11px] font-semibold uppercase tracking-wide">
                                  {dayChipLabel(d)}
                                </span>
                                <span className="font-display text-2xl leading-tight">
                                  {dayNum(d)}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>

                        <div className="mb-3 mt-5 flex items-center justify-between">
                          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            <Clock className="h-4 w-4 text-primary" aria-hidden />
                            {formatLongDate(date)}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fetchAvailability(date)}
                            className="h-9 gap-1.5 rounded-lg text-xs text-muted-foreground hover:text-primary"
                            aria-label="Refresh availability"
                          >
                            <RefreshCw
                              className={`h-3.5 w-3.5 ${slotsLoading ? "animate-spin" : ""}`}
                              aria-hidden
                            />
                            Refresh
                          </Button>
                        </div>

                        {/* slots */}
                        {slotsLoading ? (
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                            {Array.from({ length: 15 }).map((_, i) => (
                              <div
                                key={i}
                                className="h-16 animate-pulse rounded-xl bg-muted/60"
                              />
                            ))}
                          </div>
                        ) : (
                          <div
                            className="grid grid-cols-3 gap-2 sm:grid-cols-5"
                            role="radiogroup"
                            aria-label="Choose a time slot"
                          >
                            {slots.map((s) => {
                              const active = s.slot === slot;
                              const selectable = slotSelectable(s);
                              const expressSpot = expressOnly(s);
                              return (
                                <motion.button
                                  key={s.slot}
                                  type="button"
                                  role="radio"
                                  aria-checked={active}
                                  aria-disabled={!selectable && !expressSpot}
                                  onClick={() => handleSlotClick(s)}
                                  whileTap={selectable || expressSpot ? { scale: 0.95 } : {}}
                                  className={`relative flex min-h-11 flex-col items-center justify-center rounded-xl border py-2 transition-all duration-200 ${
                                    active
                                      ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                      : expressSpot
                                        ? "border-dashed border-primary/50 bg-primary/[0.07] text-primary/90 hover:bg-primary/15"
                                        : selectable
                                          ? "border-border/60 bg-background/40 text-foreground hover:border-primary/50 hover:bg-primary/[0.08]"
                                          : "cursor-not-allowed border-border/40 bg-background/20 text-muted-foreground/40 line-through"
                                  }`}
                                >
                                  <span className="text-sm font-semibold">{s.label}</span>
                                  <span
                                    className={`mt-0.5 flex items-center gap-1 text-[10px] ${
                                      active
                                        ? "text-primary-foreground/80"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {expressSpot ? (
                                      <>
                                        <Zap className="h-3 w-3 fill-current" aria-hidden />
                                        express only
                                      </>
                                    ) : selectable ? (
                                      isExpress
                                        ? `${s.expressLeft} express left`
                                        : `${s.regularLeft} left`
                                    ) : (
                                      "full"
                                    )}
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        )}

                        {/* legend */}
                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                            Open
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Zap className="h-3 w-3 fill-primary text-primary" aria-hidden />
                            Standard full — Express open
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-muted-foreground/40 line-through" aria-hidden />
                            Fully booked
                          </span>
                        </div>
                      </motion.div>
                    ) : null}

                    {/* ------------------------------ STEP 3 ------------------------------ */}
                    {step === 3 ? (
                      <motion.div
                        key="step-3"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          <Zap className="h-4 w-4 text-primary" aria-hidden />
                          Service speed
                        </h3>

                        <ExpressToggle checked={isExpress} onChange={changeExpress} />

                        <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          Your details
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="flex flex-col gap-1.5">
                            <Label htmlFor="bk-name">
                              Full name <span className="text-primary">*</span>
                            </Label>
                            <Input
                              id="bk-name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Alex Carter"
                              autoComplete="name"
                              className="h-11 rounded-xl border-border/70 bg-background/50"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Label htmlFor="bk-phone">
                              Phone <span className="text-primary">*</span>
                            </Label>
                            <Input
                              id="bk-phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+1 555 010 2288"
                              autoComplete="tel"
                              className="h-11 rounded-xl border-border/70 bg-background/50"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label htmlFor="bk-email">Email (optional)</Label>
                            <Input
                              id="bk-email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@example.com"
                              autoComplete="email"
                              className="h-11 rounded-xl border-border/70 bg-background/50"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label htmlFor="bk-notes">Notes for your barber (optional)</Label>
                            <Textarea
                              id="bk-notes"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Skin fade with a hard part, beard line-up…"
                              rows={3}
                              className="resize-none rounded-xl border-border/70 bg-background/50"
                            />
                          </div>
                        </div>

                        {/* mobile summary */}
                        <div className="mt-5 lg:hidden">
                          <SummaryPanel
                            service={selectedService}
                            date={date}
                            slot={slot}
                            isExpress={isExpress}
                          />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* nav buttons */}
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-5">
                  <Button
                    variant="outline"
                    onClick={() => goTo((step - 1) as Step)}
                    disabled={step === 1}
                    className="h-12 rounded-xl border-border/70 px-5 font-semibold hover:bg-primary/10 hover:text-primary"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Back
                  </Button>

                  {step < 3 ? (
                    <Button
                      onClick={() => goTo((step + 1) as Step)}
                      disabled={!canContinue}
                      className="h-12 flex-1 rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 disabled:opacity-40 sm:flex-none sm:px-8"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  ) : (
                    <Button
                      onClick={submit}
                      disabled={!canContinue || submitting}
                      className={`h-12 flex-1 rounded-xl px-6 font-bold sm:flex-none sm:px-8 ${
                        isExpress
                          ? "glow-pulse bg-primary text-primary-foreground"
                          : "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      }`}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          Locking it in…
                        </>
                      ) : (
                        <>
                          Confirm — {formatPrice((selectedService?.price ?? 0) + (isExpress ? EXPRESS_FEE : 0))}
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sidebar summary (desktop) */}
          {booking ? null : (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <SummaryPanel
                  service={selectedService}
                  date={date}
                  slot={slot}
                  isExpress={isExpress}
                />
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
