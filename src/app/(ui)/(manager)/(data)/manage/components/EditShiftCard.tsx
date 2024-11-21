import { useEffect, useRef, useState } from "react";
import Dropdown from "@/components/Dropdown";
import DateSelector from "@/components/DateSelector";
import { Tables } from "@/lib/supabase.types";
import {
  combineDateTime,
  convertTimeAMPM,
  formatDate,
  formatTime
} from "@/utils/DateTime";
import useFeedbackFetch from "@/hooks/FeedbackFetch";
import EditConfirmation from "./EditConfirmation";
import { useUIComponentsContext } from "@/contexts/UIComponentsContext";
import { FeedbackType } from "@/components/Feedback";
import { SHIFT_TYPES } from "@/utils/Constants";

interface EditShiftCardProps {
  shift: Tables<"shifts">;
  refreshShifts: () => Promise<void>;
}

export default function EditShiftCard({
  shift,
  refreshShifts
}: EditShiftCardProps) {
  const [date, setDate] = useState<Date | null>(new Date(shift.checked_in_at));
  const [checkinTime, setCheckinTime] = useState<string | null>(
    formatTime(shift.checked_in_at)
  );
  const [checkoutTime, setCheckoutTime] = useState<string | null>(
    formatTime(shift.checked_out_at)
  );
  const [shiftType, setShiftType] = useState<string | null>(shift.shift_type);
  const [isEditing, setIsEditing] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const feedbackFetch = useFeedbackFetch();
  const { setPopup, setFeedback, loading, popup } = useUIComponentsContext();

  const executeEditShift = async (
    id: string,
    intime: string,
    outtime: string,
    type: string
  ) => {
    await feedbackFetch(
      `/api/shifts/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          intime,
          outtime,
          type
        }),
        headers: {
          "Content-Type": "application/json"
        }
      },
      {
        callback: async () => {
          await refreshShifts();
          setPopup(null);
          setIsEditing(false);
          setIsHighlighted(true);
          setTimeout(() => setIsHighlighted(false), 3000);
        }
      }
    );
  };

  const isDataUnchanged = () =>
    date?.getTime() === new Date(shift.checked_in_at).getTime() &&
    checkinTime === formatTime(shift.checked_in_at) &&
    checkoutTime === formatTime(shift.checked_out_at) &&
    shiftType === shift.shift_type;

  const showMissingFieldsWarning = () => {
    const missingFields = [];
    if (!date) missingFields.push("date");
    if (!checkinTime) missingFields.push("check in time");
    if (!checkoutTime) missingFields.push("check out time");
    if (!shiftType) missingFields.push("shift type");
    let message = "Please provide ";
    if (missingFields.length === 1) {
      message += missingFields[0];
    } else {
      message += `${missingFields.slice(0, -1).join(", ")} and ${missingFields.slice(-1)}`;
    }
    setFeedback({
      type: FeedbackType.Warning,
      message: `${message}!`
    });
  };

  const handleButtonClick = () => {
    if (loading) return;
    if (isEditing) {
      if (isDataUnchanged()) {
        setFeedback({
          type: FeedbackType.Success,
          message: "No changes were made!"
        });
        setIsEditing(false);
        return;
      }
      if (date && checkinTime && checkoutTime && shiftType) {
        setPopup({
          title: "Confirm new shift details",
          component: (
            <EditConfirmation
              data={[
                { key: "Name", value: shift.volunteer_name },
                { key: "Date", value: formatDate(date) },
                {
                  key: "Time",
                  value: `${convertTimeAMPM(checkinTime)} - ${convertTimeAMPM(checkoutTime)}`
                },
                { key: "Shift Type", value: shiftType }
              ]}
              onConfirm={() =>
                executeEditShift(
                  shift.id,
                  combineDateTime(date, checkinTime),
                  combineDateTime(date, checkoutTime),
                  shiftType
                )
              }
            />
          )
        });
      } else {
        showMissingFieldsWarning();
      }
    } else {
      setIsEditing(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !loading &&
        !popup
      ) {
        setIsEditing(false);
        setDate(new Date(shift.checked_in_at));
        setCheckinTime(formatTime(shift.checked_in_at));
        setCheckoutTime(formatTime(shift.checked_out_at));
        setShiftType(shift.shift_type);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    shift.checked_in_at,
    shift.checked_out_at,
    shift.shift_type,
    loading,
    popup
  ]);

  return (
    <div
      ref={ref}
      className={`edit-card flex w-full justify-between border-b-[1px] border-y-pedals-darkgrey px-20 py-4 ${isEditing || isHighlighted ? "bg-pedals-lightgrey" : "bg-pedals-grey"}`}
    >
      <div className="flex items-center justify-start">
        <h3 className="w-96">{shift.volunteer_name}</h3>
        {isEditing ? (
          <DateSelector
            className="-ml-[12px] w-[300px]"
            selected={date}
            onChange={(d) => setDate(d as Date | null)}
          />
        ) : (
          <p className="w-72 uppercase">{formatDate(date)}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex w-48 justify-center">
            <input
              type="time"
              value={checkinTime as string}
              onChange={(e) => setCheckinTime(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <p>-</p>
          <div className="flex w-48 justify-center uppercase">
            {checkoutTime === null && !isEditing ? (
              <p>{shift.is_active ? "Active" : "Error"}</p>
            ) : (
              <input
                type="time"
                value={checkoutTime as string}
                onChange={(e) => setCheckoutTime(e.target.value)}
                disabled={!isEditing}
              />
            )}
          </div>
        </div>
        {isEditing ? (
          <Dropdown
            className="ml-40 w-64 -translate-x-3"
            options={SHIFT_TYPES}
            currentOption={shiftType}
            onClick={(e) => {
              e.preventDefault();
              setShiftType((e.target as HTMLButtonElement).value || null);
            }}
            centerParentFix="-translate-y-[22px]"
          />
        ) : (
          <p className="ml-40 uppercase">{shift.shift_type}</p>
        )}
      </div>
      <button
        aria-disabled={loading}
        type="button"
        className="!rounded-[30px] !px-12"
        onClick={handleButtonClick}
      >
        {isEditing ? "Done" : "Edit"}
      </button>
    </div>
  );
}
