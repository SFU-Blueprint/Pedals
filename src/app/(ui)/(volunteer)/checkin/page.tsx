"use client";

import { useState, FormEvent } from "react";
import FormInput from "@/components/FormInput";
import ShiftSelect from "../components/ShiftSelect";
import useFeedbackFetch from "@/hooks/FeedbackFetch";
import { useVolunteerContext } from "@/contexts/VolunteerPagesContext";
import { useUIComponentsContext } from "@/contexts/UIComponentsContext";
import { FeedbackType } from "@/components/Feedback";
import { validUsername } from "@/utils/Validators";
import { SHIFT_TYPES } from "@/utils/Constants";

export default function CheckinPage() {
  const [username, setUsername] = useState("");
  const [shiftType, setShiftType] = useState<string | null>(null);
  const feedbackFetch = useFeedbackFetch();
  const { fetchActiveShifts } = useVolunteerContext();
  const { setFeedback, loading } = useUIComponentsContext();

  const handleCheckin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!username || !shiftType) {
      let message = "";
      if (!username && !shiftType) {
        message = "Please provide your username and current shift type!";
      } else if (!username) {
        message = "Please provide your username!";
      } else if (!shiftType) {
        message = "Please select current shift type!";
      }
      setFeedback({
        type: FeedbackType.Warning,
        message
      });
      return;
    }
    if (!validUsername(username)) {
      setFeedback({
        type: FeedbackType.Warning,
        message:
          "Username must be alphanumeric, without spaces, and contains 5-15 characters."
      });
      return;
    }
    await feedbackFetch(
      "/api/checkin",
      {
        method: "POST",
        body: JSON.stringify({ username, shiftType }),
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        }
      },
      {
        callback: async () => fetchActiveShifts({ showSuccessFeedback: false })
      }
    );
  };

  return (
    <form
      className="flex items-end justify-between px-20 py-10"
      onSubmit={handleCheckin}
    >
      <div className="flex justify-start gap-96">
        <FormInput
          uppercase
          className="w-[25rem]"
          label="Username"
          type="text"
          placeholder="TYPE"
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
        />
        <ShiftSelect
          className="w-[25rem]"
          options={SHIFT_TYPES}
          selectedOption={shiftType}
          onChange={setShiftType}
        />
      </div>
      <div>
        <button
          aria-disabled={!username || !shiftType || loading}
          type="submit"
          className="whitespace-nowrap"
        >
          Check In
        </button>
      </div>
    </form>
  );
}
