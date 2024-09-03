"use client";

import { useState, FormEvent } from "react";
import FormInput from "@/components/FormInput";
import VolunteerCard from "../components/VolunteerCard";
import ShiftSelect from "../components/ShiftSelect";

export default function Checkin() {
  const [userName, setUserName] = useState("");
  const [shiftType, setShiftType] = useState<string | null>(null);

  const handleCheckinVolunteer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await fetch("/api/checkin", {
        method: "POST",
        body: JSON.stringify({
          userName,
          shiftType
        })
      });
    } catch (error) {
      // do something
    }
  };

  const mockInfo = [
    {
      firstName: "Johnny",
      lastName: "Test",
      timeIn: "11:10am",
      shift: "PFTP"
    },
    {
      firstName: "Mark",
      lastName: "Hamburg",
      timeIn: "10:00am",
      shift: "PFTP"
    }
  ];

  const mockOptions = ["option 1", "option 2", "option 3"];

  return (
    <div className="flex flex-col">
      <form
        className="flex items-end justify-between gap-96 px-20 py-10"
        onSubmit={handleCheckinVolunteer}
      >
        <div className="flex justify-start gap-96">
          <FormInput
            className="w-96"
            label="Username"
            type="text"
            placeholder="Type"
            onChange={(e) => setUserName(e.target.value)}
          />
          <ShiftSelect
            className="w-96"
            options={mockOptions}
            selectedOption={shiftType}
            onChange={setShiftType}
          />
        </div>
        <button
          disabled={!userName || !shiftType}
          type="submit"
          className={`whitespace-nowrap uppercase ${userName && shiftType ? "!bg-pedals-yellow" : "cursor-not-allowed !bg-transparent"}`}
        >
          Check In
        </button>
      </form>
      {mockInfo.map((item) => (
        <VolunteerCard
          firstName={item.firstName}
          lastName={item.lastName}
          timeIn={item.timeIn}
          shift={item.shift}
        />
      ))}
    </div>
  );
}
