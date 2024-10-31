"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import ActiveShiftsGrid from "../components/ActiveShiftsGrid";
import FormInput from "@/components/FormInput";
import DateSelector from "@/components/DateSelector";
import { Tables } from "@/lib/supabase.types";
import TimeDisplay from "../components/TimeDisplay";
import useFeedbackFetch from "@/hooks/FeedbackFetch";
import { useUIComponentsContext } from "@/contexts/UIComponentsContext";
import { FeedbackType } from "@/components/Feedback";

export default function RegisterPage() {
  const [username, setUsername] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [dob, setDOB] = useState<Date | null>();
  const [activeShifts, setActiveShifts] = useState<Tables<"shifts">[]>([]);
  const feedbackFetch = useFeedbackFetch();
  const { setFeedback } = useUIComponentsContext();

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

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^[a-z0-9]{1,30}$/.test(username)) {
      setFeedback({
        type: FeedbackType.Warning,
        message:
          "Username must be lowercase, alphanumeric, and less than 30 characters."
      });
      setTimeout(() => setFeedback(null), 2500);
    } else {
      await feedbackFetch(
        "/api/register", // URL
        {
          method: "POST",
          body: JSON.stringify({
            username,
            fullName,
            dob
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
  };

  useEffect(() => {
    fetchActiveShifts();
  }, [fetchActiveShifts]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-y-hidden">
      <div className="sticky top-0 bg-pedals-lightgrey">
        <TimeDisplay className="pl-20 pt-20" />
        <form
          className="flex items-start justify-between gap-40 px-20 py-10"
          onSubmit={handleRegister}
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-start gap-96">
              <FormInput
                uppercase
                className="w-[25rem]"
                label="Username"
                type="text"
                placeholder="TYPE"
                onChange={(e) => setUsername(e.target.value)}
              />
              <FormInput
                className="w-[25rem]"
                label="Full Name"
                type="text"
                placeholder="TYPE"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <FormInput
              className="w-[25rem]"
              label="(If Under 18) Date of Birth"
            >
              <DateSelector
              className="w-full"
              selected={dob}
              onChange={(date) => setDOB(date)}
              maxDate={new Date()}
              
              />
            </FormInput>
          </div>
          <button
            disabled={!username || !fullName}
            type="submit"
            className="mt-[34px] whitespace-nowrap uppercase"
          >
            Register
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
