import { db } from "@/lib/db";

const SERVICES = [
  // ---------- Barber chair ----------
  {
    slug: "signature-haircut",
    name: "Signature Haircut",
    description:
      "Consultation, precision scissor cut, wash and a styled finish tailored to your head shape.",
    price: 199,
    duration: 45,
    icon: "scissors",
    popular: true,
    sortOrder: 1,
  },
  {
    slug: "skin-fade",
    name: "Premium Skin Fade",
    description:
      "Razor-sharp fade blended seamless from skin to length. Crisp lines, flawless gradient.",
    price: 249,
    duration: 45,
    icon: "zap",
    popular: true,
    sortOrder: 2,
  },
  {
    slug: "beard-trim",
    name: "Beard Sculpt & Trim",
    description:
      "Shape, line-up and hot towel finish with beard oil. From stubble to full beard.",
    price: 149,
    duration: 30,
    icon: "slice",
    popular: false,
    sortOrder: 3,
  },
  {
    slug: "hot-towel-shave",
    name: "Royal Hot Towel Shave",
    description:
      "Traditional straight-razor shave with triple hot towels, pre-shave oil and balm.",
    price: 199,
    duration: 40,
    icon: "flame",
    popular: true,
    sortOrder: 4,
  },
  {
    slug: "cut-beard-combo",
    name: "Cut + Beard Combo",
    description:
      "The full works — signature haircut paired with a beard sculpt. Leave fully reset.",
    price: 299,
    duration: 60,
    icon: "crown",
    popular: true,
    sortOrder: 5,
  },
  {
    slug: "kids-cut",
    name: "Kids Cut (u12)",
    description:
      "Patient, friendly cuts for the young gentlemen. Cartoon on the tablet included.",
    price: 99,
    duration: 30,
    icon: "smile",
    popular: false,
    sortOrder: 6,
  },
  // ---------- Beauty parlor ----------
  {
    slug: "glow-facial",
    name: "Glow Facial & Clean-up",
    description:
      "Deep cleanse, exfoliation and a radiance-boosting massage with premium serums.",
    price: 599,
    duration: 45,
    icon: "sparkles",
    popular: true,
    sortOrder: 7,
  },
  {
    slug: "hair-spa",
    name: "Hair Spa & Deep Care",
    description:
      "Steam, mask and scalp massage that repairs, softens and adds mirror shine.",
    price: 699,
    duration: 60,
    icon: "droplets",
    popular: true,
    sortOrder: 8,
  },
  {
    slug: "party-makeup",
    name: "Party Makeup & Styling",
    description:
      "Occasion-ready HD makeup with hair styling — parties, sangeets and photo days.",
    price: 999,
    duration: 60,
    icon: "gem",
    popular: true,
    sortOrder: 9,
  },
  {
    slug: "mani-pedi",
    name: "Luxury Mani + Pedi",
    description:
      "Soak, scrub, cuticle care and polish for hands and feet — the full reset.",
    price: 499,
    duration: 60,
    icon: "hand",
    popular: false,
    sortOrder: 10,
  },
  {
    slug: "wax-thread",
    name: "Waxing & Threading",
    description:
      "Gentle roll-on waxing and precise threading with soothing post-care gel.",
    price: 299,
    duration: 30,
    icon: "flower",
    popular: false,
    sortOrder: 11,
  },
  {
    slug: "womens-cut-style",
    name: "Women's Cut & Blow-Dry",
    description:
      "Trend-aware cut, wash and a voluminous blow-dry finish by our senior stylist.",
    price: 499,
    duration: 60,
    icon: "brush",
    popular: true,
    sortOrder: 12,
  },
];

let seeded = false;

/** Idempotently ensure the full barber + beauty catalogue exists (upserts by slug). */
export async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  for (const s of SERVICES) {
    await db.service.upsert({
      where: { slug: s.slug },
      create: { ...s },
      update: {
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
        icon: s.icon,
        popular: s.popular,
        sortOrder: s.sortOrder,
      },
    });
  }
  seeded = true;
}
