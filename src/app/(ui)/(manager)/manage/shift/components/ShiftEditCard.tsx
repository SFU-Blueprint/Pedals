"use client";
// add use state to all components so that it holds the value including the dropdown
// done should save all
// use datselector and dropdown to pass props
// for now keep in child then eventually we need to move to parent component
import { useState } from "react";
import Dropdown from "@/components/Dropdown";
import DateSelector from "@/components/DateSelector";

export default function ShiftEditCard() {
  const [isEditing, setIsEditing] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [checkinTime, setCheckinTime] = useState<string>("");
  const [checkoutTime, setCheckoutTime] = useState<string>("");
  const [selectedShiftType, setSelectedShiftType] = useState<string | null>("WTQ");

  const [savedData, setSavedData] = useState({
    date: null as Date | null,
    checkinTime: "",
    checkoutTime: "",
    shiftType: "",
  })

  const handleDone = () => {
    setIsEditing(false);

    setSavedData({
      date: selectedDate,
      checkinTime,
      checkoutTime,
      shiftType: selectedShiftType || ""
    })
  }

  return (
    <div
      className={`edit-card flex w-full justify-between border-y-[1px] border-y-pedals-darkgrey px-20 py-4 ${isEditing ? "bg-pedals-lightgrey" : "bg-pedals-stroke"}`}
    >
      {!isEditing ? (
        <div className="flex items-center justify-start">
          <h3 className="w-96">Name</h3>
          <p className="w-72">{savedData.date ? savedData.date.toLocaleDateString() : "Date"}</p>
          <div className="flex items-center justify-between">
            <p className="flex w-48 justify-center uppercase">
                {savedData.checkinTime || "Checkin Time"}
            </p>
            <p>-</p>
            <p className="flex w-48 justify-center uppercase">
              {savedData.checkoutTime || "Checkout Time"}
            </p>
          </div>
          <p className="ml-40 uppercase">{savedData.shiftType || "Shift Type"}</p>
        </div>
      ) : (
        <div className="flex items-center justify-start">
          <h3 className="w-96">Name</h3>
          <DateSelector
            className="w-72"
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
          />
          <div className="flex items-center justify-between">
            <div className="flex w-48 justify-center">
              <input
                type="time"
                value={checkinTime}
                onChange={(e) => setCheckinTime(e.target.value)}
              />
            </div>
            <p>-</p>
            <div className="flex w-48 justify-center">
              <input
                type="time"
                value={checkoutTime}
                onChange={(e) => setCheckoutTime(e.target.value)}
              />
            </div>
          </div>
          <Dropdown
            className="ml-40 w-40"
            options={["WTQ", "PFTP", "Option 1", "Option 2"]}
            currentOption={selectedShiftType}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              const newValue = (e.target as HTMLButtonElement).value;
              setSelectedShiftType(newValue);
            }}
            centerParentFix="-translate-y-[22px]"
          />
        </div>
      )}

      <button
        type="button"
        className="!rounded-[30px] !px-12 uppercase"
        onClick={() => {
          if (isEditing) {
            handleDone();
          } else {
            setIsEditing(true);
          }
        }}
      >
        {isEditing ? "Done" : "Edit"}
      </button>
    </div>
  );
}
