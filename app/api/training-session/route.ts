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

    return NextResponse.json({ data: sessions });
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
