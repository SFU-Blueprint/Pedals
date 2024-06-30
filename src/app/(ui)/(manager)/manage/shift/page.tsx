"use client";

import { useState } from "react";
import FormInput from "@/components/FormInput";
import Dropdown from "@/components/Dropdown";
import ShiftCard from "@/components/ShiftManager";

export default function Checkin() {
  return (
    <>
      <div></div>
      <div className="flex items-center justify-between bg-gray-200 py-2">
        <div className="flex-1 text-center">Name</div>
        <div className="flex-1 text-center">Date</div>
        <div className="flex-1 text-center">Check In</div>
        <div className="flex-1 text-center">Check Out</div>
        <div className="flex-1 text-center">Shift</div>
      </div>
      <ShiftCard />
    </>
  );
}

function ManageShift() {}

/* Shift Type
          <div className="col-span-3 flex flex-col">
            {" "}
            <h1 className="mb-2 text-[18px]">ShiftName</h1>
            <div className="flex flex-row">
              <button type="button" className="mr-10 bg-white px-3 py-1">
                PFTP
              </button>
              <button type="button" className="mr-10 bg-white px-3 py-1">
                WTQ
              </button>
              <div className="mr-10 flex justify-center bg-white px-3 py-1 align-middle">
                <select className="bg-white">
                  <option> Option 1 </option>
                  <option> Option 2 </option>
                  <option> Option 3 </option>
                </select>
              </div>
            </div>
          </div> */
