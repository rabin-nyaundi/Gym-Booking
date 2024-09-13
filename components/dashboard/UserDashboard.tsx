import React from "react";
import MyBookings from "./MyBookings";
import OverviewCard from "./card";

import { MdEventAvailable } from "react-icons/md";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Booking, BookingStatus, Role } from "@prisma/client";
import GroupedBookingBySlot from "./booking/booking";
import AllBookings from "./booking/all-bookings";
import prisma from "@/lib/prisma";

interface BookingResponse {
  bookingsCompleted: Booking[];
  upcomingBookings: Booking[];
  todayBookings: Booking[];
  completedCount: number;
}

async function getAllBookings(): Promise<BookingResponse | null> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    // Bookings completed
    const bookingsCompleted =
      (await prisma?.booking.findMany({
        where: {
          status: BookingStatus.Booked,
          trainingDate: {
            lt: new Date(),
          },
        },
      })) || [];

    const completedCount =
      (await prisma?.booking.count({
        where: {
          status: BookingStatus.Booked,
          trainingDate: {
            lt: new Date(),
          },
        },
      })) || 0;

    // Upcoming bookings
    const upcomingBookings =
      (await prisma?.booking.findMany({
        where: {
          status: BookingStatus.Booked,
          trainingDate: {
            gt: new Date(),
          },
        },
      })) || [];

    // Today's bookings
    const todayBookings =
      (await prisma?.booking.findMany({
        where: {
          status: BookingStatus.Booked,
          trainingDate: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      })) || [];

    return {
      bookingsCompleted,
      upcomingBookings,
      todayBookings,
      completedCount,
    };
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return null;
  }
}

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);

  const {
    bookingsCompleted = [],
    upcomingBookings = [],
    todayBookings = [],
    completedCount = 0,
  } = (await getAllBookings()) || ({} as BookingResponse);

  return (
    <div className="w-full flex flex-col bg-white dark:bg-inherit lg:gap-8 gap-4 h-full">
      {session?.user.role === Role.ADMIN && (
        <div className="flex lg:flex-row flex-col justify-center items-center lg:items-start lg:justify-around  w-full gap-8">
          {upcomingBookings.length > 0 ? (
            <OverviewCard
              item={{
                count: upcomingBookings.length,
                label: `Upcoming Bookings`,
                hint: `Upcoming bookings.`,
                icon: <MdEventAvailable className="h-8 w-8" />,
                booking: upcomingBookings,
              }}
            />
          ) : (
            <OverviewCard
              item={{
                count: 0,
                label: `Upcoming Bookings`,
                hint: `Upcoming bookings.`,
                icon: <MdEventAvailable className="h-8 w-8" />,
                booking: upcomingBookings,
              }}
            />
          )}

          {todayBookings.length > 0 ? (
            <OverviewCard
              item={{
                count: todayBookings.length,
                label: `Today Bookings`,
                hint: `All bookings today.`,
                icon: <MdEventAvailable className="h-8 w-8" />, // Provide appropriate icon
                booking: todayBookings,
              }}
            />
          ) : (
            <OverviewCard
              item={{
                count: 0,
                label: `Today Bookings`,
                hint: `All bookings today.`,
                icon: <MdEventAvailable className="h-8 w-8" />, // Provide appropriate icon
                booking: todayBookings,
              }}
            />
          )}

          {bookingsCompleted.length > 0 ? (
            <OverviewCard
              item={{
                count: bookingsCompleted.length,
                label: `Completed Bookings`,
                hint: `All bookings completed.`,
                icon: <MdEventAvailable className="h-8 w-8" />, // Provide appropriate icon
                booking: bookingsCompleted,
              }}
            />
          ) : (
            <OverviewCard
              item={{
                count: 0,
                label: `Completed Bookings`,
                hint: `All bookings completed.`,
                icon: <MdEventAvailable className="h-8 w-8" />,
                booking: bookingsCompleted,
              }}
            />
          )}
        </div>
      )}
      <div className="flex lg:flex-row flex-col w-full gap-6 lg:gap-10 h-auto">
        {session?.user.role === Role.ADMIN ? (
          <div className="flex gap-4 flex-col w-full h-auto">
            <GroupedBookingBySlot />
            <div className="flex flex-col">
              <AllBookings />
            </div>
          </div>
        ) : (
          <MyBookings />
        )}
      </div>
    </div>
  );
}
