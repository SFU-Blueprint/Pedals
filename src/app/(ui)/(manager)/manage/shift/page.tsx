"use client";

import ShiftCard from "@/components/ShiftCard";

export default function ManageShift() {
  return (
    <>
      <div className="flex items-center justify-between bg-pedals-grey px-16 py-2">
        <div className="text-center">Name</div>
        <div className="text-center">Date</div>
        <div className="text-center">Check In</div>
        <div className="text-center">Check Out</div>
        <div className="text-center">Shift</div>
      </div>
      <ShiftCard />
    </>
  );
}
