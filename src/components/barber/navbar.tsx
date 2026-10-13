"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, Scissors, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHOP_NAME } from "@/lib/constants";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#express", label: "Express Pass" },
  { href: "#gallery", label: "The Shop" },
  { href: "#book", label: "Booking" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 140);
    setScrolled(latest > 24);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 ${
          scrolled
            ? "my-2 rounded-2xl border border-border/60 bg-background/80 py-2.5 shadow-lg shadow-black/30 backdrop-blur-xl sm:my-3"
            : "bg-transparent py-4"
        }`}
      >
        <a
          href="#top"
          className="group flex min-h-11 items-center gap-2.5"
          aria-label={`${SHOP_NAME} home`}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25 transition-transform duration-300 group-hover:rotate-12">
            <Scissors className="h-4.5 w-4.5" aria-hidden />
          </span>
          <span className="font-display text-2xl tracking-wider text-foreground">
            {SHOP_NAME}
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
          <Button
            asChild
            className="ml-3 rounded-xl bg-primary font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/35"
          >
            <a href="#book">Book a Chair</a>
          </Button>
        </nav>

        <button
          className="grid h-11 w-11 place-items-center rounded-xl border border-border/60 bg-card/60 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mx-4 mt-2 rounded-2xl border border-border/60 bg-popover/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl md:hidden"
            aria-label="Mobile"
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3.5 text-base font-medium text-foreground/90 transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <Button asChild className="mt-2 w-full rounded-xl bg-primary py-6 font-semibold text-primary-foreground">
              <a href="#book" onClick={() => setOpen(false)}>
                Book a Chair
              </a>
            </Button>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
