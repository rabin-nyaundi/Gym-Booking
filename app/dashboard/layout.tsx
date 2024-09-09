import type { Metadata } from "next";

import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topBar";
import BottomNavigationBar from "@/components/layout/bottom-navbar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "TechGym - View and Reserve sessions",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"h-screen w-screen"}>
        <div className="relative h-full flex w-full">
          <div className="lg:w-72  h-full hidden lg:flex">
            <Sidebar />
          </div>
          <div className="flex flex-col w-full mb-16 pb-4 overflow-hidden">
            <TopBar />
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden lg:p-10 p-3">
              {children}
            </div>
          </div>
          <div className="fixed bottom-0 inset-x-0">
            <BottomNavigationBar />
          </div>
        </div>
      </body>
    </html>
  );
}
