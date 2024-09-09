import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const userId = session?.user?.id;

    const bookings = await prisma.booking.findMany({
      // where: userId ? { userId: parseInt(userId) } : {},
      where: {
        ...(userId ? { userId: parseInt(userId) } : {}),
      },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
            id: true,
            name: true,
            role: true,
          },
        },
        session: {
          select: {
            slot: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: bookings });
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
