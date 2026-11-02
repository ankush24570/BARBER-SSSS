import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  BOOKING_DAYS_AHEAD,
  CHAIRS_PER_SLOT,
  EXPRESS_CHAIRS_PER_SLOT,
  EXPRESS_FEE,
} from "@/lib/constants";
import {
  generateAllSlots,
  isSlotInPast,
  isValidBookingDate,
} from "@/lib/slots";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  isExpress: z.boolean(),
  customerName: z.string().trim().min(2, "Name is too short").max(60),
  phone: z.string().trim().min(7, "Phone number looks too short").max(20),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(280).optional().or(z.literal("")),
});

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars

function generateCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return `FB-${code}`;
}

async function createUniqueCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const exists = await db.booking.findUnique({ where: { code } });
    if (!exists) return code;
  }
  return `FB-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

/** POST /api/bookings — create a booking (standard or express). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the highlighted fields.",
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Validate date & slot
    if (!isValidBookingDate(data.date, BOOKING_DAYS_AHEAD)) {
      return NextResponse.json(
        { error: "That date is out of the booking window (next 14 days)." },
        { status: 400 }
      );
    }
    if (!generateAllSlots().includes(data.timeSlot)) {
      return NextResponse.json(
        { error: "That time slot is outside our opening hours." },
        { status: 400 }
      );
    }
    if (isSlotInPast(data.date, data.timeSlot)) {
      return NextResponse.json(
        { error: "That time has already passed — please pick an upcoming slot." },
        { status: 400 }
      );
    }

    const service = await db.service.findUnique({
      where: { id: data.serviceId },
    });
    if (!service || !service.active) {
      return NextResponse.json(
        { error: "That service is not available." },
        { status: 404 }
      );
    }

    // Capacity check
    const slotBookings = await db.booking.findMany({
      where: { date: data.date, timeSlot: data.timeSlot, status: "CONFIRMED" },
      select: { isExpress: true },
    });
    const regularCount = slotBookings.filter((b) => !b.isExpress).length;
    const expressCount = slotBookings.length - regularCount;

    if (data.isExpress) {
      if (expressCount >= EXPRESS_CHAIRS_PER_SLOT) {
        return NextResponse.json(
          { error: "Express seats for this slot are fully reserved. Try another time." },
          { status: 409 }
        );
      }
    } else if (regularCount >= CHAIRS_PER_SLOT) {
      return NextResponse.json(
        {
          error:
            "Standard chairs are fully booked for this slot. Express seats may still be open — upgrade for just ₹" + EXPRESS_FEE + " to lock it in.",
          code: "SLOT_FULL_TRY_EXPRESS",
        },
        { status: 409 }
      );
    }

    const expressFee = data.isExpress ? EXPRESS_FEE : 0;
    const totalPrice = service.price + expressFee;
    const code = await createUniqueCode();

    const booking = await db.booking.create({
      data: {
        code,
        serviceId: service.id,
        customerName: data.customerName,
        phone: data.phone,
        email: data.email || null,
        date: data.date,
        timeSlot: data.timeSlot,
        isExpress: data.isExpress,
        expressFee,
        totalPrice,
        notes: data.notes || null,
      },
      include: { service: true },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    console.error("POST /api/bookings failed:", err);
    return NextResponse.json(
      { error: "Could not complete the booking. Please try again." },
      { status: 500 }
    );
  }
}

/** GET /api/bookings?code=FB-XXXXXX — look up a booking. */
export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code")?.trim().toUpperCase();
    if (!code) {
      return NextResponse.json(
        { error: "Provide a booking code, e.g. ?code=FB-ABC123." },
        { status: 400 }
      );
    }
    const booking = await db.booking.findUnique({
      where: { code },
      include: { service: true },
    });
    if (!booking) {
      return NextResponse.json(
        { error: "No booking found for that code." },
        { status: 404 }
      );
    }
    return NextResponse.json({ booking });
  } catch (err) {
    console.error("GET /api/bookings failed:", err);
    return NextResponse.json(
      { error: "Lookup failed. Please try again." },
      { status: 500 }
    );
  }
}
