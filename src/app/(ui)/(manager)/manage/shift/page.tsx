"use client";

import { useCallback, useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import FormInput from "@/components/FormInput";
import EditShiftsGrid from "../components/EditShiftsGrid";
import { Tables } from "@/lib/supabase.types";
import useFeedbackFetch from "@/hooks/FeedbackFetch";
import { isInMonth, isInYear } from "@/utils";

export default function ManageShiftPage() {
  const [searchName, setSearchName] = useState("");
  const [searchMonth, setSearchMonth] = useState<string | null>(null);
  const [searchYear, setSearchYear] = useState<number | null>(null);
  const [shifts, setShifts] = useState<Tables<"shifts">[]>([]);
  const feedbackFetch = useFeedbackFetch();

  const fetchShifts = useCallback(
    async (
      options: { showSuccessFeedback: boolean } = { showSuccessFeedback: true }
    ) => {
      await feedbackFetch(
        "/api/shifts",
        {
          method: "GET"
        },
        {
          callback: (data) => setShifts(data as Tables<"shifts">[]),
          showSuccessFeedback: options.showSuccessFeedback
        }
      );
    },
    [feedbackFetch]
  );

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  const filteredShifts = shifts
    ?.filter((shift) => {
      const nameMatch = searchName
        ? shift.volunteer_name?.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const monthMatch = searchMonth
        ? isInMonth(shift.checked_in_at, shift.checked_out_at, searchMonth)
        : true;
      const yearMatch = searchYear
        ? isInYear(shift.checked_in_at, shift.checked_out_at, searchYear)
        : true;
      return nameMatch && monthMatch && yearMatch;
    })
    .sort((a, b) => {
      if (!a.is_active && !a.checked_out_at) return -1;
      if (!b.is_active && !b.checked_out_at) return 1;
      const dateA = (
        a.checked_in_at ? new Date(a.checked_in_at) : new Date()
      ).getTime();
      const dateB = (
        b.checked_in_at ? new Date(b.checked_in_at) : new Date()
      ).getTime();
      return dateB - dateA;
    });

  return (
    <>
      <div className="sticky top-0 z-20 flex justify-end gap-2 bg-pedals-lightgrey pb-9 pr-20 pt-36">
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
        shifts={filteredShifts}
        refreshShifts={() => fetchShifts({ showSuccessFeedback: false })}
      />
    </>
  );
}
