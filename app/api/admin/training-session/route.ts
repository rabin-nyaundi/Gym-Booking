import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const sessions = await prisma.trainingSession.findMany({
      include: {
        bookings: {
          select: {
            trainingDate: true,
          },
        },
      },
    });

    const sessionCounts = sessions.map((session) => {
      const bookingCount = session.bookings.length;

      return {
        sessionId: session.id,
        slot: session.slot,
        count: bookingCount,
      };
    });

    return NextResponse.json({ data: sessionCounts });
  } catch (error: any) {
    const message = error?.message || error;
    console.log(error?.response?.data);
    return NextResponse.json(
      { error: message },
      {
        status: 500,
      }
    );
  }
}
