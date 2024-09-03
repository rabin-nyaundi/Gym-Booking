import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface OverviewCardProps {
  count: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
}

export default function OverviewCard({ item }: { item: OverviewCardProps }) {
  return (
    <Card className="w-full flex flex-col max-w-xs p-4 bg-white dark:bg-inherit shadow">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-gray-500 text-base font-medium">
          {item.label}
        </CardTitle>
        <span className="text-gray-500">{item.icon}</span>
      </CardHeader>
      <CardContent className="items-center justify-center">
        <div className="text-3xl font-semibold text-gray-900 dark:text-white">
          {item.count}
        </div>
        <div className="mt-1 text-sm text-green-500">{item.hint}</div>
      </CardContent>
    </Card>
  );
}
