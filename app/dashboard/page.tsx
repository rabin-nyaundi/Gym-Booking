import UserDashboard from "@/components/dashboard/UserDashboard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

async function page() {
  return (
    <div className="w-full flex h-full">
      <UserDashboard />
    </div>
  );
}

export default page;
