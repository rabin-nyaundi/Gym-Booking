import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  try {
    const bookingDate = new Date(tomorrow);
    bookingDate.setHours(0, 0, 0, 0);

    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: Number(userId),
        createdAt: {
          gte: bookingDate,
          lt: new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000),
        },
        status: BookingStatus.Booked,
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "You already have a booking for this date." },
        {
          status: 400,
        }
      );
    }

    const sessionBookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: bookingDate,
          lt: new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000),
        },
        session: {
          id: body?.sessionId,
        },

        status: BookingStatus.Booked,
      },
    });

    if (sessionBookings.length >= 5) {
      return NextResponse.json(
        {
          error: "This session is full for the selected date.",
        },
        {
          status: 400,
        }
      );
    }

    const today = new Date();

    const trainingDay = new Date(today);
    trainingDay.setDate(today.getDate() + 1);

    const booking = await prisma.booking.create({
      data: {
        userId: Number(userId),
        createdAt: new Date(),
        trainingDate: new Date(trainingDay),
        sessionId: Number(body?.sessionId),
      },
    });

    return NextResponse.json({ booking });
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const userId = session?.user?.id;

    const bookings = await prisma.booking.findMany({
      // where: userId ? { userId: parseInt(userId) } : {},
      where: {
        ...(userId ? { userId: parseInt(userId) } : {}),
        status: {
          not: BookingStatus.Deleted,
        },
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

// Soft Delete Booking

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Verify if the user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user?.id;

    // Parse bookingId from the request URL or body (depends on how you send it)
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId"); // If it's sent as a query parameter

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Find the booking and ensure it belongs to the user (or check permissions)
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Ensure the booking belongs to the user or check permissions (optional)
    if (booking.userId !== parseInt(userId)) {
      return NextResponse.json(
        { error: "You do not have permission to delete this booking" },
        { status: 403 }
      );
    }

    // Perform the soft delete by updating the booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.Deleted }, // Assuming "Deleted" is a valid status in BookingStatus enum
    });

    return NextResponse.json(
      { message: "Booking successfully deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    const message = error?.message || error;
    console.log(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

//patch
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Verify if the user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user?.id;

    // Parse bookingId and status from the request body
    const { bookingId, status } = await req.json();

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: "Booking ID and status are required" },
        { status: 400 }
      );
    }

    // Ensure the status is either 'Rejected' or 'Cancelled'
    if (![BookingStatus.Rejected, BookingStatus.Cancelled].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be either "Rejected" or "Cancelled".' },
        { status: 400 }
      );
    }

    // Find the booking and ensure it belongs to the user (or check permissions)
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Ensure the booking belongs to the user or check permissions (optional)
    if (booking.userId !== parseInt(userId)) {
      return NextResponse.json(
        { error: "You do not have permission to update this booking" },
        { status: 403 }
      );
    }

    // Update the booking status to either 'Rejected' or 'Cancelled'
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status }, // Update status dynamically
    });

    return NextResponse.json(
      { message: `Booking status updated to ${status}` },
      { status: 200 }
    );
  } catch (error: any) {
    const message = error?.message || error;
    console.log(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
