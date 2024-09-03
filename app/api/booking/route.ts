import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  try {
    const booking1 = await prisma.$transaction(async (prisma) => {
      // retrive the training session
      const session = await prisma.trainingSession.findUnique({
        where: {
          id: Number(body.sessionId),
        },
      });

      if (!session || session.capacity >= session.maxCapacity) {
        return NextResponse.json(
          { error: "Slot full. Seslect another slot" },
          { status: 400 }
        );
      }

      const existingBooking = await prisma.booking.findFirst({
        where: {
          userId: Number(userId),
          status: "booked",
          trainingDate: {
            gte: tomorrow,
            lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
          },
          session: {
            // id: session.id,
            timeSlot: session.timeSlot,
          },
        },
      });

      console.log("====================================");
      console.log(session, existingBooking);
      console.log("====================================");

      if (existingBooking) {
        return NextResponse.json(
          { error: "You have booked a session already" },
          { status: 400 }
        );
      }

      await prisma.trainingSession.update({
        where: {
          id: Number(body.sessionId),
        },
        data: {
          capacity: {
            increment: 1,
          },
        },
      });

      return await prisma.booking.create({
        data: {
          user: { connect: { id: Number(userId) } },
          session: { connect: { id: Number(body.sessionId) } },
          status: body.status,
          trainingDate: tomorrow,
        },
      });
    });

    // const booking = await prisma.booking.create({
    //   data: {
    //     user: { connect: { id: Number(userId) } },
    //     session: { connect: { id: Number(body.sessionId) } },
    //     status: body.status,
    //     trainingDate: tomorrow,
    //   },
    // });

    return NextResponse.json({ booking1 });
  } catch (error: any) {
    const message = error?.message || error;
    console.log(error);
    return NextResponse.json(
      { error: message },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    const userId = session?.user?.id;

    const bookings = await prisma.booking.findMany({
      where: userId ? { userId: parseInt(userId) } : {},
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
        session: true,
      },
    });

    console.log("====================================");
    console.log(bookings);
    console.log("====================================");

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
