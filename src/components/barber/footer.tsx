"use client";

import { Clock, MapPin, Phone, Scissors } from "lucide-react";
import { OPENING_HOURS_LABEL, SHOP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Scissors className="h-4.5 w-4.5" aria-hidden />
            </span>
            <span className="font-display text-2xl tracking-wider">{SHOP_NAME}</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            A modern take on the classic neighborhood unisex salon. Barbering
            and beauty under one roof, with chairs you can actually book.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Visit Us
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              128 Elm Street, Downtown
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <a href="tel:+15550102288" className="transition-colors hover:text-primary">
                +1 555 010 2288
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              {OPENING_HOURS_LABEL}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
            <li>
              <a href="#services" className="transition-colors hover:text-primary">
                Services & Prices
              </a>
            </li>
            <li>
              <a href="#express" className="transition-colors hover:text-primary">
                Express Priority Pass
              </a>
            </li>
            <li>
              <a href="#book" className="transition-colors hover:text-primary">
                Book a Chair
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/40 py-5">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SHOP_NAME}. All rights reserved. Walk-ins
          welcome, bookings preferred.
        </p>
      </div>
    </footer>
  );
}
