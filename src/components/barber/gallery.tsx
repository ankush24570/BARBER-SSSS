"use client";

import { motion } from "framer-motion";
import { RevealGroup, RevealItem, SectionHeading } from "./reveal";

const SHOTS = [
  {
    src: "/images/gallery-cut.png",
    alt: "Barber crafting a precision scissor cut",
    caption: "Precision Cuts",
    span: "row-span-2",
  },
  {
    src: "/images/gallery-beard.png",
    alt: "Straight razor beard sculpting detail",
    caption: "Beard Sculpting",
    span: "",
  },
  {
    src: "/images/gallery-shave.png",
    alt: "Hot towel shave with steam rising",
    caption: "Hot Towel Ritual",
    span: "",
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
      <SectionHeading
        kicker="Inside The Shop"
        title="WHERE THE CRAFT HAPPENS"
        subtitle="Leather chairs, warm bulbs and steady hands. A look at the everyday ritual at Fade & Blade."
      />

      <RevealGroup className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2">
        {/* wide feature shot */}
        <RevealItem className="col-span-2 row-span-2">
          <motion.figure
            whileHover={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="group relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-border/70 md:min-h-full"
          >
            <img
              src="/images/hero-bg.png"
              alt="The Fade & Blade floor — leather chairs under warm Edison bulbs"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <figcaption className="absolute bottom-4 left-4 font-display text-2xl tracking-wider text-white">
              THE FLOOR
            </figcaption>
          </motion.figure>
        </RevealItem>

        {SHOTS.map((shot) => (
          <RevealItem key={shot.src} className={shot.span}>
            <motion.figure
              whileHover={{ scale: 0.985 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="group relative h-full min-h-[150px] overflow-hidden rounded-2xl border border-border/70 md:min-h-[220px]"
            >
              <img
                src={shot.src}
                alt={shot.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <figcaption className="absolute bottom-3 left-3 font-display text-lg tracking-wider text-white">
                {shot.caption}
              </figcaption>
            </motion.figure>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
