"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import FormInput from "@/components/FormInput";
import ShiftSelect from "../components/ShiftSelect";
import ActiveShiftsGrid from "../components/ActiveShiftsGrid";
import { Tables } from "@/lib/supabase.types";

export default function Checkin() {
  const [username, setUsername] = useState("");
  const [shiftType, setShiftType] = useState<string | null>(null);
  const [activeShifts, setActiveShifts] = useState<Tables<"shifts">[]>([]);

  const fetchActiveShifts = useCallback(async () => {
    try {
      const response = await fetch("/api/shifts/active", {
        method: "GET"
      });
      if (response.status === 500) {
        // This will be handoff to Terry for feedback popup
      } else if (response.status === 200) {
        setActiveShifts((await response.json()) as Tables<"shifts">[]);
      }
    } catch (error) {
      // This will be handoff to Terry for feedback popup
    }
  }, []);

  const handleCheckin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        body: JSON.stringify({
          username,
          shiftType
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        await fetchActiveShifts();
        // This will be handoff to Terry for feedback popup
      } else {
        // This will be handoff to Terry for feedback popup
      }
    } catch (error) {
      // This will be handoff to Terry for feedback popup
    }
  };

  useEffect(() => {
    fetchActiveShifts();
  }, [fetchActiveShifts]);

  const mockOptions = ["option 1", "option 2", "option 3"];
  return (
    <div className="flex flex-col">
      <form
        className="flex items-end justify-between gap-96 px-20 py-10"
        onSubmit={handleCheckin}
      >
        <div className="flex justify-start gap-96">
          <FormInput
            className="w-96"
            label="Username"
            type="text"
            placeholder="Type"
            onChange={(e) => setUsername(e.target.value)}
          />
          <ShiftSelect
            className="w-96"
            options={mockOptions}
            selectedOption={shiftType}
            onChange={setShiftType}
          />
        </div>
        <button
          disabled={!username || !shiftType}
          type="submit"
          className={`whitespace-nowrap uppercase ${username && shiftType ? "!bg-pedals-yellow" : "cursor-not-allowed !bg-transparent"}`}
        >
          Check In
        </button>
      </form>
      <ActiveShiftsGrid
        shifts={activeShifts}
        refreshShifts={fetchActiveShifts}
      />
    </div>
  );
}
