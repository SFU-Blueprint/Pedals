"use client";

import { useEffect, useRef, useState } from "react";
import Dropdown from "@/components/Dropdown";
import DateSelector from "@/components/DateSelector";
import { Tables } from "@/lib/supabase.types";

interface EditShiftsGridProps {
  shifts: Tables<"shifts">[];
  refreshShifts: () => Promise<void>;
  filter: {
    name: string;
    month: string | null;
    year: number | null;
  };
}

interface EditShiftCardProps {
  shift: Tables<"shifts">;
  refreshShifts: () => Promise<void>;
}

function EditShiftCard({ shift, refreshShifts }: EditShiftCardProps) {
  const checkinDateTime =
    (shift.checked_in_at && new Date(shift.checked_in_at)) || null;
  const checkoutDateTime =
    (shift.checked_out_at && new Date(shift.checked_out_at)) || null;

  const [date, setDate] = useState<Date | null>(() => {
    const checkinDate = checkinDateTime?.toLocaleDateString("en-US");
    return checkinDate &&
      checkoutDateTime?.toLocaleDateString("en-US") === checkinDate
      ? new Date(checkinDate)
      : null;
  });

  const [checkinTime, setCheckinTime] = useState<string | null>(
    checkinDateTime &&
      new Date(checkinDateTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false
      })
  );

  const [checkoutTime, setCheckoutTime] = useState<string | null>(
    checkoutDateTime &&
      new Date(checkoutDateTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false
      })
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
          <p className="w-72">
            {date?.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            }) ?? "Error"}
          </p>
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
              {(checkinDateTime &&
                new Date(checkinDateTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true
                })) ??
                "Error"}
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
                : (checkoutDateTime &&
                    new Date(checkoutDateTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    })) ??
                  "Error"}
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
        className="!rounded-[30px] !px-12 uppercase"
        onClick={() => {
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
  filter
}: EditShiftsGridProps) {
  return (
    <div className="flex h-full flex-col bg-pedals-grey">
      <div className="flex items-center justify-start px-20 py-2">
        <p className="w-96">Name</p>
        <p className="w-72">Date</p>
        <div className="flex justify-between gap-3">
          <p className="flex w-48 justify-center">Check In</p>
          <p className="flex w-48 justify-center">Check Out</p>
        </div>
        <p className="ml-40">Shift</p>
      </div>
      {shifts?.map((shift) => (
        <EditShiftCard
          key={shift.id}
          shift={shift}
          refreshShifts={refreshShifts}
        />
      ))}
    </div>
  );
}
