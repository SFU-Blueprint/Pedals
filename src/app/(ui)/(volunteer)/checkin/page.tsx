"use client";

import { useState } from "react";
import FormInput from "@/components/FormInput";
import Dropdown from "@/components/Dropdown";
import Volunteer from "@/components/Volunteer";

const fakeInfo = [
  {
    firstName: "Johnny",
    lastName: "Test",
    timeIn: "Since 11:10am",
    id: "test"
  },
  {
    firstName: "Mark",
    lastName: "Hamburg",
    timeIn: "Since 10:00am",
    id: "test"
  }
];

function ShiftSelect() {
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  return (
    <FormInput label="Shift Type">
      <div className="flex gap-2">
        <button
          type="button"
          className={selectedShift === "PFTP" ? "bg-pedals-yellow" : ""}
          onClick={() => setSelectedShift("PFTP")}
        >
          PFTP
        </button>
        <button
          type="button"
          className={selectedShift === "PFTP" ? "bg-pedals-yellow" : ""}
          onClick={() => setSelectedShift("WTQ")}
        >
          WTQ
        </button>
        <Dropdown
          className={`${selectedShift === "PFTP" ? "bg-pedals-yellow" : ""} uppercase`}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" }
          ]}
          onChange={() => setSelectedShift("dropdown")}
          placeholder="SELECT"
        />
      </div>
    </FormInput>
  );
}

export default function Checkin() {
  return (
    <div className="flex flex-col">
      {" "}
      <form className="flex justify-between gap-20 px-20 py-10">
        <FormInput
          className="w-4/12 flex-initial"
          label="Username"
          type="text"
          placeholder="TYPE"
        />
        <ShiftSelect />
        <button type="submit" className="min-w-[200px]">
          Check In
        </button>
      </form>
      {fakeInfo.map(
        (item: {
          firstName: String;
          lastName: String;
          timeIn: String;
          id: any;
        }) => (
          <Volunteer
            firstName={item.firstName}
            lastName={item.lastName}
            timeIn={item.timeIn}
            id={item.id}
          />
        )
      )}
    </div>
  );
}

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
