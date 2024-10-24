"use client";

import { useCallback, useMemo, useState } from "react";
import useFeedbackFetch from "@/hooks/FeedbackFetch";
import ActiveShiftsGrid from "./components/ActiveShiftsGrid";
import { Tables } from "@/lib/supabase.types";
import TimeDisplay from "./components/TimeDisplay";
import VolunteerContext from "@/contexts/VolunteerPagesContext";

export default function VolunteerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [activeShifts, setActiveShifts] = useState<Tables<"shifts">[]>([]);
  const feedbackFetch = useFeedbackFetch();

  const fetchActiveShifts = useCallback(
    async (
      options: { showSuccessFeedback: boolean } = { showSuccessFeedback: true }
    ) => {
      await feedbackFetch(
        "/api/shifts/active",
        { method: "GET" },
        {
          callback: (data) => setActiveShifts(data as Tables<"shifts">[]),
          showSuccessFeedback: options.showSuccessFeedback
        }
      );
    },
    [feedbackFetch]
  );

  return (
    <VolunteerContext.Provider
      value={useMemo(() => ({ fetchActiveShifts }), [fetchActiveShifts])}
    >
      <div className="flex h-screen w-screen flex-col overflow-y-hidden">
        <div className="sticky top-0 bg-pedals-lightgrey">
          <TimeDisplay className="pl-20 pt-20" />
          {children}
        </div>
        <ActiveShiftsGrid
          shifts={activeShifts}
          refreshShifts={() =>
            fetchActiveShifts({ showSuccessFeedback: false })
          }
        />
      </div>
    </VolunteerContext.Provider>
  );
}
