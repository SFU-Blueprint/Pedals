"use client";

import { useCallback, useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import FormInput from "@/components/FormInput";
import EditShiftsGrid from "./components/EditShiftsGrid";
import { Tables } from "@/lib/supabase.types";
import Feedback, { FeedbackType } from "@/components/Feedback";

export default function ManageShiftPage() {
  const [searchName, setSearchName] = useState("");
  const [searchMonth, setSearchMonth] = useState<string | null>(null);
  const [searchYear, setSearchYear] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<[FeedbackType, string] | null>(null);

  const [shifts, setShifts] = useState<Tables<"shifts">[]>([]);

  const fetchShifts = useCallback(
    async (
      options: { showSuccessFeedback: boolean } = { showSuccessFeedback: true }
    ) => {
      setFeedback([FeedbackType.Loading, "Loading"]);
      try {
        const response = await fetch("/api/shifts", {
          method: "GET"
        });
        const data = await response.json();
        if (response.status === 200) {
          setShifts(data as Tables<"shifts">[]);
          if (options.showSuccessFeedback) {
            setFeedback([FeedbackType.Success, "Shifts loaded."]);
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

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  return (
    <>
      <div className="sticky top-0 flex justify-end gap-2 pb-9 pr-20 pt-36">
        <FormInput
          className="w-80"
          type="text"
          placeholder="Search Name"
          onChange={(e) => setSearchName(e.target.value)}
        />
        <Dropdown
          className="w-40"
          options={Array.from({ length: 12 }, (_v, i) =>
            new Date(0, i).toLocaleString("en", { month: "short" })
          )}
          currentOption={searchMonth}
          placeholder="Month"
          onClick={(e) => {
            e.preventDefault();
            setSearchMonth((e.target as HTMLButtonElement).value || null);
          }}
        />
        <Dropdown
          className="w-40"
          options={Array.from(
            { length: new Date().getFullYear() - 2020 + 1 },
            (_v, i) => 2020 + i
          )}
          currentOption={searchYear}
          placeholder="Year"
          onClick={(e) => {
            e.preventDefault();
            setSearchYear(
              Number((e.target as HTMLButtonElement).value) || null
            );
          }}
        />
      </div>
      <EditShiftsGrid
        shifts={shifts}
        refreshShifts={() => fetchShifts({ showSuccessFeedback: false })}
        propagateFeedback={setFeedback}
        filter={{
          name: searchName,
          month: searchMonth,
          year: searchYear
        }}
      />
      {feedback && <Feedback type={feedback[0]}>{feedback[1]}</Feedback>}
    </>
  );
}
