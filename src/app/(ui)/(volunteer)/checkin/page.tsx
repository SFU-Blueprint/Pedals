"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import FormInput from "@/components/FormInput";
import ShiftSelect from "../components/ShiftSelect";
import ActiveShiftsGrid from "../components/ActiveShiftsGrid";
import { Tables } from "@/lib/supabase.types";
import TimeDisplay from "../components/TimeDisplay";
import useFeedbackFetch from "@/hooks/FeedbackFetch";

export default function CheckinPage() {
  const [username, setUsername] = useState("");
  const [shiftType, setShiftType] = useState<string | null>(null);
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

  const handleCheckin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await feedbackFetch(
      "/api/checkin",
      {
        method: "POST",
        body: JSON.stringify({ username, shiftType }),
        headers: {
          "Content-Type": "application/json"
        }
      },
      {
        callback: async () => fetchActiveShifts({ showSuccessFeedback: false })
      }
    );
  };

  useEffect(() => {
    fetchActiveShifts();
  }, [fetchActiveShifts]);

  const shiftOptions = [
    "General Onsite",
    "Wheel Service",
    "Wheel Building",
    "Wheel Recycling",
    "Bike Stripping",
    "Inner Tubes",
    "Shop Organizing",
    "Offsite Event",
    "Youth Volunteering"
  ];

  return (
    <div className="flex h-screen w-screen flex-col overflow-y-hidden">
      <div className="sticky top-0 bg-pedals-lightgrey">
        <TimeDisplay className="pl-20 pt-20" />
        <form
          className="flex items-end justify-between gap-96 px-20 py-10"
          onSubmit={handleCheckin}
        >
          <div className="flex justify-start gap-96">
            <FormInput
              uppercase
              className="w-96"
              label="Username"
              type="text"
              placeholder="TYPE"
              onChange={(e) => setUsername(e.target.value)}
            />
            <ShiftSelect
              className="w-96"
              options={shiftOptions}
              selectedOption={shiftType}
              onChange={setShiftType}
            />
          </div>
          <button
            disabled={!username || !shiftType}
            type="submit"
            className="whitespace-nowrap uppercase"
          >
            Check In
          </button>
        </form>
      </div>
      <ActiveShiftsGrid
        shifts={activeShifts}
        refreshShifts={() => fetchActiveShifts({ showSuccessFeedback: false })}
      />
    </div>
  );
}
