import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { subDays } from "date-fns";

export async function GET() {
  try {
    const oneWeekAgo = subDays(new Date(), 30);

    const sessions = await prisma.booking.findMany({
      where: {
        // trainingDate: {
        //   gte: new Date(oneWeekAgo.setHours(0, 0, 0, 0)),
        //   lt: new Date(oneWeekAgo.setHours(23, 59, 59, 999)),
        // },
      },

      include: {
        user: {
          select: {
            name: true,
          },
        },
        session: {
          select: {
            slot: true,
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
