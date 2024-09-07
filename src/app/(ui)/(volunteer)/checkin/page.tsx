"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import FormInput from "@/components/FormInput";
import ShiftSelect from "../components/ShiftSelect";
import ActiveShiftsGrid from "../components/ActiveShiftsGrid";
import { Tables } from "@/lib/supabase.types";
import Feedback, { FeedbackType } from "@/components/Feedback";

export default function CheckinPage() {
  const [username, setUsername] = useState("");
  const [shiftType, setShiftType] = useState<string | null>(null);
  const [activeShifts, setActiveShifts] = useState<Tables<"shifts">[]>([]);
  const [feedback, setFeedback] = useState<[FeedbackType, string] | null>(null);

  const fetchActiveShifts = useCallback(
    async (
      options: { showSuccessFeedback: boolean } = { showSuccessFeedback: true }
    ) => {
      setFeedback([FeedbackType.Loading, "Loading"]);
      try {
        const response = await fetch("/api/shifts/active", {
          method: "GET"
        });
        const data = await response.json();
        if (response.status === 200) {
          setActiveShifts(data as Tables<"shifts">[]);
          if (options.showSuccessFeedback) {
            setFeedback([FeedbackType.Success, "Active shifts loaded."]);
          }
        } else if (response.status >= 400 && response.status < 500) {
          setFeedback([FeedbackType.Warning, data.message]);
        } else if (response.status >= 500 && response.status < 600) {
          setFeedback([FeedbackType.Error, data.message]);
        }
      } catch (error) {
        setFeedback([FeedbackType.Error, "Unknown Error"]);
      }
      setTimeout(() => setFeedback(null), 2500);
    },
    []
  );

  const handleCheckin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setFeedback([FeedbackType.Loading, "Loading"]);
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
      const data = await response.json();
      if (response.status === 200) {
        await fetchActiveShifts({ showSuccessFeedback: false });
        setFeedback([FeedbackType.Success, data.message]);
      } else if (response.status >= 400 && response.status < 500) {
        setFeedback([FeedbackType.Warning, data.message]);
      } else if (response.status >= 500 && response.status < 600) {
        setFeedback([FeedbackType.Error, data.message]);
      }
    } catch (error) {
      setFeedback([FeedbackType.Error, "Unknown Error"]);
    }
    setTimeout(() => setFeedback(null), 2500);
  };

  useEffect(() => {
    fetchActiveShifts();
  }, [fetchActiveShifts]);

  const mockOptions = ["option 1", "option 2", "option 3"];
  return (
    <div className="flex flex-grow flex-col">
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
        refreshShifts={() => fetchActiveShifts({ showSuccessFeedback: false })}
        propagateFeedback={setFeedback}
      />
      {feedback && <Feedback type={feedback[0]}>{feedback[1]}</Feedback>}
    </div>
  );
}
