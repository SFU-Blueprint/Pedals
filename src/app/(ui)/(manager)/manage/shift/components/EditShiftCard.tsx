import { useEffect, useRef, useState } from "react";
import Dropdown from "@/components/Dropdown";
import DateSelector from "@/components/DateSelector";
import { Tables } from "@/lib/supabase.types";
import { combineDateTime, formatDate, formatTime } from "@/utils";
import useFeedbackFetch from "@/hooks/FeedbackFetch";

interface EditShiftCardProps {
  shift: Tables<"shifts">;
  refreshShifts: () => Promise<void>;
}

export default function EditShiftCard({
  shift,
  refreshShifts
}: EditShiftCardProps) {
  const feedbackFetch = useFeedbackFetch();
  const handleEditShift = async (
    shiftId: string,
    inTime: string,
    outTime: string,
    type: string
  ) => {
    await feedbackFetch(
      `/api/shifts/${shiftId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          inTime,
          outTime,
          type
        }),
        headers: {
          "Content-Type": "application/json"
        }
      },
      {
        callback: async () => refreshShifts()
      }
    );
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
            className="-ml-[10px] w-[298px]"
            selected={date}
            onSelect={(d) => setDate(d)}
          />
        ) : (
          <p className="w-72 uppercase">{formatDate(date)}</p>
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
            className="ml-40 w-60 -translate-x-3"
            options={[
              "WTQ",
              "PFTP",
              "General Onsite",
              "Wheel Service",
              "Wheel Building",
              "Wheel Recycling",
              "Bike Stripping",
              "Inner Tubes",
              "Shop Organizing",
              "Offsite Event",
              "Youth Volunteering"
            ]}
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
