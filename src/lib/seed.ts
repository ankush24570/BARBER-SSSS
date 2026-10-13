import { db } from "@/lib/db";

const SERVICES = [
  {
    slug: "signature-haircut",
    name: "Signature Haircut",
    description:
      "Consultation, precision scissor cut, wash and a styled finish tailored to your head shape.",
    price: 28,
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
    price: 32,
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
    price: 18,
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
    price: 30,
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
    price: 42,
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
    price: 16,
    duration: 30,
    icon: "smile",
    popular: false,
    sortOrder: 6,
  },
];

let seeded = false;

/** Idempotently ensure the service catalogue exists. */
export async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  const count = await db.service.count();
  if (count === 0) {
    await db.service.createMany({ data: [...SERVICES] });
  }
  seeded = true;
}
