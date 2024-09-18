"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import ShiftSelect from "../components/ShiftSelect";
import ActiveShiftsGrid from "../components/ActiveShiftsGrid";
import FormInput from "@/components/FormInput";
import DateSelector from "@/components/DateSelector";
import { Tables } from "@/lib/supabase.types";
import Feedback, { FeedbackType } from "@/components/Feedback";

export default function RegisterPage() {
  const [username, setUsername] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [shiftType, setShiftType] = useState<string | null>(null);
  const [dob, setDOB] = useState<Date | null>(new Date());
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

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback([FeedbackType.Loading, "Loading"]);
    try {
      const registerResponse = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          username,
          fullName,
          dob
        })
      });
      const registerData = await registerResponse.json();

      if (registerResponse.status === 200) {
        const checkinResponse = await fetch("/api/checkin", {
          method: "POST",
          body: JSON.stringify({
            username,
            shiftType
          })
        });
        const data = await checkinResponse.json();
        if (checkinResponse.status === 200) {
          await fetchActiveShifts({ showSuccessFeedback: false });
          setFeedback([FeedbackType.Success, data.message]);
        } else if (
          checkinResponse.status >= 400 &&
          checkinResponse.status < 500
        ) {
          setFeedback([FeedbackType.Warning, data.message]);
        } else if (
          checkinResponse.status >= 500 &&
          checkinResponse.status < 600
        ) {
          setFeedback([FeedbackType.Error, data.message]);
        }
      } else if (
        registerResponse.status >= 400 &&
        registerResponse.status < 500
      ) {
        setFeedback([FeedbackType.Warning, registerData.message]);
      } else if (
        registerResponse.status >= 500 &&
        registerResponse.status < 600
      ) {
        setFeedback([FeedbackType.Error, registerData.message]);
      }
    } catch (error) {
      // Handle any error that occurs in the try block
      setFeedback([FeedbackType.Error, "An unexpected error occurred."]);
    }

    setTimeout(() => setFeedback(null), 2500);
  };

  useEffect(() => {
    fetchActiveShifts();
  }, [fetchActiveShifts]);

  const mockOptions = ["Option 1", "Option 2", "Option 3"];
  return (
    <div className="flex flex-grow flex-col">
      <form
        className="flex items-start justify-between gap-40 px-20 py-10"
        onSubmit={handleRegister}
      >
        <div className="flex flex-col gap-3">
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
          <div className="flex justify-start gap-96">
            <FormInput
              className="w-96"
              label="Full Name"
              type="text"
              placeholder="Type"
              onChange={(e) => setFullName(e.target.value)}
            />
            <FormInput label="Date of Birth">
              <DateSelector selected={dob} onChange={(date) => setDOB(date)} />
            </FormInput>
          </div>
        </div>
        <button
          disabled={!username || !shiftType || !fullName || !dob}
          type="submit"
          className="mt-[34px] whitespace-nowrap uppercase"
        >
          Check In
        </button>
      </form>
      <ActiveShiftsGrid
        shifts={activeShifts}
        refreshShifts={fetchActiveShifts}
        propagateFeedback={setFeedback}
      />
      {feedback && <Feedback type={feedback[0]}>{feedback[1]}</Feedback>}
    </div>
  );
}
