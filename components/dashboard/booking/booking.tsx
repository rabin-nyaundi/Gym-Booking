import { Button } from "@/components/ui/button";
import { CiCalendarDate } from "react-icons/ci";

const people = [
  {
    name: "Leslie Alexander",
    email: "leslie.alexander@example.com",
    role: "Co-Founder / CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },

  {
    name: "Leslie Alexander",
    email: "leslie.alexander@example.com",
    role: "Co-Founder / CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  // More people...
];

//tommorow bookins
// todays bookins
// this weeks bookings

export default function Booking() {
  return (
    <div className="w-full flex flex-col gap-4">
      {people.map((person) => (
        <div
          key={person.email}
          className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 justify-between focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
          <div className="flex gap-2">
            <div className="flex-shrink-0">
              <CiCalendarDate className="h-8 w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <a href="#" className="focus:outline-none">
                <span aria-hidden="true" className="absolute inset-0" />
                <p className="text-sm font-medium text-gray-900">
                  {`${new Date().getHours()}:${new Date().getMinutes()}PM`}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {new Date().toLocaleDateString()}
                </p>
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button variant={"destructive"}>Cancel</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
