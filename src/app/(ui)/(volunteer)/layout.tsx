"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
          callback: (data) => setActiveShifts(data.sort((a: any,b: any)=>{
            if (a.checked_in_at > b.checked_in_at){
              return -1;
            }
              return 1;
          }) as Tables<"shifts">[]),
          showSuccessFeedback: options.showSuccessFeedback
        }
      );
    },
    [feedbackFetch]
  );

  useEffect(() => {
    fetchActiveShifts();
  }, [fetchActiveShifts]);

  return (
    <VolunteerContext.Provider
      value={useMemo(() => ({ fetchActiveShifts }), [fetchActiveShifts])}
    >
      <div className="flex h-screen w-screen flex-col">
        <TimeDisplay className="ml-20 mt-20" />
        {children}
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
