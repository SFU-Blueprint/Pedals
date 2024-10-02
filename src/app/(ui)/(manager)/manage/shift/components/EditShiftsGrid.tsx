"use client";

import { useEffect, useRef, useState } from "react";
import Dropdown from "@/components/Dropdown";
import DateSelector from "@/components/DateSelector";
import { Tables } from "@/lib/supabase.types";
import {
  combineDateTime,
  formatDate,
  formatTime,
  isInMonth,
  isInYear
} from "@/utils";
import { FeedbackType } from "@/components/Feedback";

interface EditShiftsGridProps {
  shifts: Tables<"shifts">[];
  refreshShifts: () => Promise<void>;
  propagateFeedback: (feedback: [FeedbackType, string] | null) => void;
  filter: {
    name: string;
    month: string | null;
    year: number | null;
  };
}

interface EditShiftCardProps {
  shift: Tables<"shifts">;
  refreshShifts: () => Promise<void>;
  propagateFeedback: (feedback: [FeedbackType, string] | null) => void;
}

function EditShiftCard({
  shift,
  refreshShifts,
  propagateFeedback
}: EditShiftCardProps) {
  const handleEditShift = async (
    shiftId: string,
    inTime: string,
    outTime: string,
    type: string
  ) => {
    propagateFeedback([FeedbackType.Loading, "Loading"]);
    try {
      const response = await fetch(`/api/shifts/${shiftId}`, {
        method: "PATCH",
        body: JSON.stringify({
          inTime,
          outTime,
          type
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (response.status === 200) {
        await refreshShifts();
        propagateFeedback([FeedbackType.Success, data.message]);
      } else if (response.status >= 400 && response.status < 500) {
        propagateFeedback([FeedbackType.Warning, data.message]);
      } else if (response.status >= 500 && response.status < 600) {
        propagateFeedback([FeedbackType.Error, data.message]);
      }
    } catch (error) {
      propagateFeedback([FeedbackType.Error, "Unknown Error"]);
    }
    setTimeout(() => propagateFeedback(null), 2500);
  };
  const [date, setDate] = useState<Date | null>(
    shift.checked_in_at ? new Date(shift.checked_in_at) : null
  );
  const [checkinTime, setCheckinTime] = useState<string | null>(
    formatTime(shift.checked_in_at)
  );
  const [checkoutTime, setCheckoutTime] = useState<string | null>(
    formatTime(shift.checked_out_at)
  );
  const [shiftType, setShiftType] = useState<string | null>(shift.shift_type);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`edit-card flex w-full justify-between border-y-[1px] border-y-pedals-darkgrey px-20 py-4 ${isEditing ? "bg-pedals-lightgrey" : "bg-pedals-stroke"}`}
    >
      <div className="flex items-center justify-start">
        <h3 className="w-96">{shift.volunteer_name ?? "Error"}</h3>
        {isEditing ? (
          <DateSelector
            className="w-72"
            selected={date}
            onChange={(d) => setDate(d)}
          />
        ) : (
          <p className="w-72">{formatDate(date)}</p>
        )}
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex w-48 justify-center">
              <input
                type="time"
                value={checkinTime as string}
                onChange={(e) => setCheckinTime(e.target.value)}
              />
            </div>
          ) : (
            <p className="flex w-48 justify-center uppercase">
              {formatTime(shift.checked_in_at, { hour12: true })}
            </p>
          )}
          <p>-</p>
          {isEditing ? (
            <div className="flex w-48 justify-center">
              <input
                type="time"
                value={checkoutTime as string}
                onChange={(e) => setCheckoutTime(e.target.value)}
              />
            </div>
          ) : (
            <p className="flex w-48 justify-center uppercase">
              {shift.is_active
                ? "Active"
                : formatTime(shift.checked_out_at, { hour12: true })}
            </p>
          )}
        </div>
        {isEditing ? (
          <Dropdown
            className="ml-40 w-40 -translate-x-3"
            options={["WTQ", "PFTP", "Option 1", "Option 2", "Option 3"]}
            currentOption={shiftType}
            onClick={(e) => {
              e.preventDefault();
              setShiftType((e.target as HTMLButtonElement).value);
            }}
            centerParentFix="-translate-y-[22px]"
          />
        ) : (
          <p className="ml-40 uppercase">{shift.shift_type}</p>
        )}
      </div>
      <button
        type="button"
        className={`!rounded-[30px] !px-12 uppercase ${isEditing && "hover:!bg-pedals-grey"}`}
        onClick={() => {
          if (isEditing) {
            if (date && checkinTime && checkoutTime && shiftType) {
              handleEditShift(
                shift.id,
                combineDateTime(date, checkinTime),
                combineDateTime(date, checkoutTime),
                shiftType
              );
            }
          }
          setIsEditing(!isEditing);
        }}
      >
        {isEditing ? "Done" : "Edit"}
      </button>
    </div>
  );
}

export default function EditShiftsGrid({
  shifts,
  refreshShifts,
  filter,
  propagateFeedback
}: EditShiftsGridProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex items-center justify-start bg-pedals-lightgrey px-20 py-2 z-10">
        <p className="w-96">Name</p>
        <p className="w-72">Date</p>
        <div className="flex justify-between gap-3">
          <p className="flex w-48 justify-center">Check In</p>
          <p className="flex w-48 justify-center">Check Out</p>
        </div>
        <p className="ml-40">Shift</p>
      </div>
      <div className="overflow-y-scroll">
        {shifts
          ?.filter((shift) => {
            const nameMatch = filter.name
              ? shift.volunteer_name
                  ?.toLowerCase()
                  .includes(filter.name.toLowerCase())
              : true;

            const monthMatch = filter.month
              ? isInMonth(
                  shift.checked_in_at,
                  shift.checked_out_at,
                  filter.month
                )
              : true;

            const yearMatch = filter.year
              ? isInYear(shift.checked_in_at, shift.checked_out_at, filter.year)
              : true;

            return nameMatch && monthMatch && yearMatch;
          })
          ?.map((shift) => (
            <EditShiftCard
              key={shift.id}
              shift={shift}
              refreshShifts={refreshShifts}
              propagateFeedback={propagateFeedback}
            />
          ))}
      </div>
    </div>
  );
}
