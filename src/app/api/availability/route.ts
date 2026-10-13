import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  BOOKING_DAYS_AHEAD,
  CHAIRS_PER_SLOT,
  EXPRESS_CHAIRS_PER_SLOT,
} from "@/lib/constants";
import {
  generateAllSlots,
  isSlotInPast,
  isValidBookingDate,
  slotLabel,
} from "@/lib/slots";
import type { SlotInfo } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/availability?date=YYYY-MM-DD
 * Returns every slot for the day with remaining standard & express capacity.
 */
export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date") ?? "";
    if (!isValidBookingDate(date, BOOKING_DAYS_AHEAD)) {
      return NextResponse.json(
        { error: "Invalid or out-of-range date. Use YYYY-MM-DD within the next 14 days." },
        { status: 400 }
      );
    }

    const bookings = await db.booking.findMany({
      where: { date, status: "CONFIRMED" },
      select: { timeSlot: true, isExpress: true },
    });

    const counts = new Map<string, { regular: number; express: number }>();
    for (const b of bookings) {
      const c = counts.get(b.timeSlot) ?? { regular: 0, express: 0 };
      if (b.isExpress) c.express += 1;
      else c.regular += 1;
      counts.set(b.timeSlot, c);
    }

    const slots: SlotInfo[] = generateAllSlots().map((slot) => {
      const c = counts.get(slot) ?? { regular: 0, express: 0 };
      const regularLeft = Math.max(0, CHAIRS_PER_SLOT - c.regular);
      const expressLeft = Math.max(0, EXPRESS_CHAIRS_PER_SLOT - c.express);
      const inPast = isSlotInPast(date, slot);
      return {
        slot,
        label: slotLabel(slot),
        regularLeft,
        expressLeft,
        regularAvailable: !inPast && regularLeft > 0,
        expressAvailable: !inPast && expressLeft > 0,
      };
    });

    return NextResponse.json({ date, slots });
  } catch (err) {
    console.error("GET /api/availability failed:", err);
    return NextResponse.json(
      { error: "Failed to load availability" },
      { status: 500 }
    );
  }
}
