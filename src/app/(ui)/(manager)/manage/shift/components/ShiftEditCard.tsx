"use client";

import { useState } from "react";
import Dropdown from "@/components/Dropdown";
import DateSelector from "@/components/DateSelector";

export default function ShiftEditCard() {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div
      className={`edit-card flex w-full justify-between border-y-[1px] border-y-pedals-darkgrey px-20 py-4 ${isEditing ? "bg-pedals-lightgrey" : "bg-pedals-stroke"}`}
    >
      {!isEditing ? (
        <div className="flex items-center justify-start">
          <h3 className="w-96">Name</h3>
          <p className="w-72">Date</p>
          <div className="flex items-center justify-between">
            <p className="flex w-48 justify-center uppercase">Checkin Time</p>
            <p>-</p>
            <p className="flex w-48 justify-center uppercase">Checkout Time</p>
          </div>
          <p className="ml-40 uppercase">Shift Type</p>
        </div>
      ) : (
        <div className="flex items-center justify-start">
          <h3 className="w-96">Name</h3>
          <DateSelector className="w-72" />
          <div className="flex items-center justify-between">
            <div className="flex w-48 justify-center">
              <input type="time" />
            </div>
            <p>-</p>
            <div className="flex w-48 justify-center">
              <input type="time" />
            </div>
          </div>
          <Dropdown
            className="ml-40 w-40"
            options={["WTQ", "PFTP", "Option 1", "Option 2"]}
            currentOption="WTQ"
            centerParentFix="-translate-y-[22px]"
          />
        </div>
      )}

      <button
        type="button"
        className="!rounded-[30px] !px-12 uppercase"
        onClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? "Done" : "Edit"}
      </button>
    </div>
  );
}
