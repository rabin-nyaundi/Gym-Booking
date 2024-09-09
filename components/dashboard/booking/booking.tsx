import { BookingStatus } from "@prisma/client";

async function getTrainingSessions() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const sessions = await prisma?.trainingSession.findMany({
    include: {
      bookings: {
        where: {
          status: BookingStatus.Booked,
          trainingDate: {
            gte: new Date(),
            lte: new Date(new Date().setHours(23, 59.59, 999)),
          },
        },
        select: {
          trainingDate: true,
        },
      },
    },
  });

  const sessionCounts = sessions?.map((session) => {
    const bookingCount = session.bookings.length;

    return {
      sessionId: session.id,
      slot: session.slot,
      count: bookingCount,
    };
  });

  return sessionCounts;
}

export default async function GroupedBookingBySlot() {
  const sessionCounts = await getTrainingSessions();
  return (
    <div className="w-full flex flex-col h-auto p-2">
      <div className="w-full flex flex-col h-auto mx-auto p-2">
        <div className="flex lg:gap-10 flex-wrap w-full justify-center items-center gap-4 m-auto">
          {sessionCounts &&
            sessionCounts.map((session, index) => (
              <div
                key={index}
                className={`border p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
                  session ? "bg-slate-100" : "bg-red-100 cursor-not-allowed"
                }`}
              >
                <h3 className="text-sm font-semibold text-gray-700">
                  {session.slot}
                </h3>
                <span> Users: {session.count}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
