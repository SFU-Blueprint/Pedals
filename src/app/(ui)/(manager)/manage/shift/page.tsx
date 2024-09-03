"use client";

import ShiftCard from "./components/ShiftEditCard";

export default function ManageShift() {
  return (
    <>
      <div className="flex items-center justify-start bg-pedals-grey px-20 py-2">
        <p className="w-96">Name</p>
        <p className="w-72">Date</p>
        <div className="flex justify-between gap-3">
          <p className="flex w-48 justify-center">Check In</p>
          <p className="flex w-48 justify-center">Check Out</p>
        </div>
        <p className="ml-40">Shift</p>
      </div>
      <ShiftCard />
    </>
  );
}
