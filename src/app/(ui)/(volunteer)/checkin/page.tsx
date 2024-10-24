"use client";

import { useState, FormEvent } from "react";
import FormInput from "@/components/FormInput";
import ShiftSelect from "../components/ShiftSelect";
import useFeedbackFetch from "@/hooks/FeedbackFetch";
import { useVolunteerContext } from "@/contexts/VolunteerPagesContext";

export default function CheckinPage() {
  const [username, setUsername] = useState("");
  const [shiftType, setShiftType] = useState<string | null>(null);
  const feedbackFetch = useFeedbackFetch();
  const { fetchActiveShifts } = useVolunteerContext();

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
    <form
      className="flex items-end justify-between gap-96 px-20 py-10"
      onSubmit={handleCheckin}
    >
      <div className="flex justify-start gap-96">
        <FormInput
          uppercase
          className="w-[25rem]"
          label="Username"
          type="text"
          placeholder="TYPE"
          onChange={(e) => setUsername(e.target.value)}
        />
        <ShiftSelect
          className="w-[25rem]"
          options={shiftOptions}
          selectedOption={shiftType}
          onChange={setShiftType}
        />
      </div>
      <div>
        <button
          disabled={!username || !shiftType}
          type="submit"
          className="whitespace-nowrap uppercase"
        >
          Check In
        </button>
      </div>
    </form>
  );
}
