"use client";

import { useCallback, useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import FormInput from "@/components/FormInput";
import EditShiftsGrid from "./components/EditShiftsGrid";
import { Tables } from "@/lib/supabase.types";

export default function ManageShiftPage() {
  const [searchName, setSearchName] = useState("");
  const [searchMonth, setSearchMonth] = useState<string | null>(null);
  const [searchYear, setSearchYear] = useState<number | null>(null);

  const [shifts, setShifts] = useState<Tables<"shifts">[]>([]);

  const fetchShifts = useCallback(async () => {
    try {
      const response = await fetch("/api/shifts", {
        method: "GET"
      });
      if (response.status === 200) {
        setShifts((await response.json()) as Tables<"shifts">[]);
        // This will be handoff to Terry for feedback popup
      } else {
        // This will be handoff to Terry for feedback popup
      }
    } catch (error) {
      // This will be handoff to Terry for feedback popup
    }
  }, []);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  return (
    <>
      <div className="sticky top-0 flex justify-end gap-2 bg-pedals-grey pb-9 pr-20 pt-36">
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
        refreshShifts={fetchShifts}
        filter={{
          name: searchName,
          month: searchMonth,
          year: searchYear
        }}
      />
    </>
  );
}
