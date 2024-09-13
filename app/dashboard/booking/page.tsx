"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TrainingSessions from "@/components/dashboard/booking/training-session";
import axios from "axios";
import {
  Booking,
  BookingStatus,
  Role,
  TrainingSession,
  User,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import AdminBookings from "@/components/dashboard/booking/admin-all-bookings";
import { TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export type TrainingSessionWithBookings = TrainingSession & {
  // session: TrainingSession[];
  bookings: Booking[];
};

export type BookingSession = Booking & {
  user: User;
  session: TrainingSession;
};

export default function Page() {
  const { data, status, update } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingSession[]>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [sessions, setSessions] = useState<TrainingSessionWithBookings[]>();

  async function getTrainingSessions() {
    try {
      const response = await axios.get("/api/training-session");

      const { data } = response.data;

      setSessions(data);
    } catch (error: any) {}
  }

  const getMyBookings = async () => {
    try {
      const response = await axios.get("/api/booking");

      const { data } = response.data;

      setBookings(data);
    } catch (error: any) {
      toast({
        title: "Error!",
        description: "Failed to retrieve my bookings",
        variant: "destructive",
      });
    }
  };

  const handleCloseModalSheet = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    getMyBookings();
  }, [router]);

  useEffect(() => {
    getTrainingSessions();
  }, [router]);

  return (
    <>
      {data?.user.role === Role.ADMIN ? (
        <AdminBookings />
      ) : (
        <div className="h-full w-full flex flex-col">
          {bookings && bookings ? (
            <div className="flex w-full flex-col h-full">
              <div className="flex justify-end w-full">
                <Button
                  onClick={() => setIsOpen(true)}
                  disabled={
                    bookings &&
                    bookings.some((booking) => {
                      const bookingDate = new Date(
                        booking.trainingDate
                      ).setHours(0, 0, 0, 0);
                      const tomorrowDate = new Date();
                      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
                      tomorrowDate.setHours(0, 0, 0, 0);
                      return (
                        bookingDate === tomorrowDate.getTime() &&
                        booking.status === BookingStatus.Booked
                      );
                    })
                  }
                >
                  Book Session
                </Button>
              </div>

              <div className="flex h-auto flex-col p-3">
                <span className="text-base lg:text-lg font-semibold">
                  Today session
                </span>
                <div className="flex flex-1 w-full h-full flex-col">
                  {bookings && (
                    <BookingListView
                      bookings={bookings.filter((booking) => {
                        let today = new Date();
                        today.setHours(0, 0, 0, 0);

                        let trainingDate = new Date(booking.trainingDate);
                        trainingDate.setHours(0, 0, 0, 0);

                        return (
                          booking.status === BookingStatus.Booked &&
                          trainingDate.getTime() === today.getTime()
                        );
                      })}
                    />
                  )}
                </div>
              </div>
              <div className="flex h-auto flex-col p-3">
                <span className="text-base lg:text-lg font-semibold">
                  Upcoming sessions
                </span>
                <div className="flex flex-1 w-full h-full flex-col">
                  {bookings && (
                    // <BookingListView
                    //   bookings={bookings
                    //     .filter((booking) => {
                    //       const isBooked =
                    //         booking.status === BookingStatus.Booked;
                    //       const today = new Date();
                    //       const endOfToday = new Date(
                    //         today.setHours(23, 59, 59, 999)
                    //       );
                    //       const bookingDate = new Date(booking?.trainingDate);

                    //       const isTodayOrEarlier = bookingDate <= endOfToday;

                    //       return isBooked && isTodayOrEarlier;
                    //     })
                    //     .map((booking) => ({
                    //       ...booking,
                    //       status: booking.status,
                    //     }))}
                    // />

                    <BookingListView
                      bookings={bookings.filter((booking) => {
                        let tomorrow = new Date(new Date().getDate() + 1);
                        tomorrow.setHours(0, 0, 0, 0);

                        let trainingDate = new Date(booking.trainingDate);
                        trainingDate.setHours(23, 59, 59, 999);

                        return (
                          booking.status === BookingStatus.Booked &&
                          trainingDate.getTime() >= tomorrow.getTime()
                        );
                      })}
                    />
                  )}
                </div>
              </div>

              <div className="flex h-full flex-1 flex-col p-3">
                <span className="text-base lg:text-lg font-semibold">
                  Past bookings
                </span>
                <div className="flex flex-1 w-full h-full flex-col">
                  {bookings && (
                    <BookingListView
                      bookings={bookings.filter(
                        (booking) => booking.status !== BookingStatus.Booked
                      )}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex h-96 items-center justify-center">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary" />
              </div>
            </div>
          )}
          <div className="flex flex-col overflow-y-auto w-full h-auto lg:hidden">
            <Sheet open={isOpen} onOpenChange={() => handleCloseModalSheet()}>
              <SheetContent className="overflow-y-auto h-auto" side={"bottom"}>
                <SheetHeader>
                  <SheetTitle>Select slot to reserve.</SheetTitle>
                  <SheetDescription>
                    {sessions && (
                      <TrainingSessions
                        sessions={sessions}
                        handleCloseSheet={() => handleCloseModalSheet()}
                      />
                    )}
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}
    </>
  );
}

function BookingListView({ bookings }: { bookings: BookingSession[] }) {
  const [isloading, setIsloading] = useState<boolean>(false);
  const [deleteBookingId, setDeleteBookingId] = useState<string>("");
  const [cancelBookingId, setCancelBookingId] = useState<string>("");

  async function handleCancelBooking(status: BookingStatus, bookingId: string) {
    setIsloading(true);
    try {
      const response = await axios.patch("/api/booking", {
        status,
        bookingId,
      });

      const { data } = response.data;
    } catch (error: any) {
      toast({
        title: "Error!",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    }
    setIsloading(false);
  }

  async function handleDeleteBooking(bookingId: string) {
    setIsloading(true);
    try {
      const response = await axios.delete(
        `/api/booking?bookingId=${bookingId}`
      );

      const { data } = response.data;
    } catch (error: any) {
      toast({
        title: "Error!",
        description: "Failed to delete my booking",
        variant: "destructive",
      });
    }
    setIsloading(false);
  }
  return (
    <>
      <ul
        role="list"
        className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2"
      >
        {bookings &&
          bookings.map((booking) => (
            <li
              key={booking.id}
              className="col-span-1 flex rounded-md shadow-sm"
            >
              <div
                className={classNames(
                  `${
                    (new Date(booking?.trainingDate).setHours(0, 0, 0, 0) ===
                      new Date().setHours(0, 0, 0, 0) ||
                      new Date(booking?.trainingDate).setHours(0, 0, 0, 0) ===
                        new Date(
                          new Date().setDate(new Date().getDate() + 1)
                        ).setHours(0, 0, 0, 0)) &&
                    booking.status === BookingStatus.Booked
                      ? "bg-primary"
                      : "bg-gray-400"
                  }`,
                  "flex w-16 lg:w-24 text-xs flex-shrink-0 items-center justify-center rounded-l-md  font-semibold px-2 text-white"
                )}
              >
                {booking.session.slot}
              </div>
              <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                <div className="flex-1 truncate px-2 lg:px-4 py-2 text-sm">
                  <span className="font-medium flex text-sm lg:text-base lg:gap-2 gap-1 text-gray-900 hover:text-gray-600">
                    Training Date:{" "}
                    {new Date(booking.trainingDate).toLocaleDateString()}
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {booking.status}
                    </span>
                  </span>
                  <p className="text-gray-500">
                    Created At:{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}{" "}
                  </p>
                </div>
                <div className="flex-shrink-0 pr-2">
                  {booking.status === BookingStatus.Booked ? (
                    <Button
                      className=" hover:bg-yellow-600 text-xs lg:text-sm lg:gap-2 px-1 lg:px-2 py-0 text-black hover:text-white"
                      disabled={isloading}
                      onClick={() => {
                        setCancelBookingId(booking.id);
                        handleCancelBooking(
                          BookingStatus.Cancelled,
                          booking.id
                        );
                      }}
                      variant={"outline"}
                      type="button"
                    >
                      <XMarkIcon className="w-5 font-extrabold h-5" />
                      <span className="hidden lg:block">
                        {" "}
                        {isloading && cancelBookingId === booking.id
                          ? "Canceling"
                          : "Cancel"}
                      </span>
                    </Button>
                  ) : (
                    <Button
                      className=" hover:bg-red-700 hover:text-white px-1 lg:gap-2 lg:px-2 text-red-500"
                      disabled={isloading}
                      onClick={() => {
                        setDeleteBookingId(booking.id);
                        handleDeleteBooking(booking.id);
                      }}
                      variant={"outline"}
                      type="button"
                    >
                      <span className="sr-only">Open options</span>
                      <TrashIcon className="w-5 h-5" />
                      <span className="hidden lg:block">
                        {isloading && deleteBookingId === booking.id
                          ? "Deleting"
                          : "Delete"}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
