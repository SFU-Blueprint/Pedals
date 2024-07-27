"use client";

import { useState, FormEvent } from "react";
import FormInput from "@/components/FormInput";
import VolunteerCard from "./components/VolunteerCard";
import ShiftSelect from "./components/ShiftSelect";

export default function Checkin() {
  const [userName, setUserName] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleCheckinVolunteer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await fetch("/api/checkin", {
        method: "POST",
        body: JSON.stringify({
          userName,
          selectedOption
        })
      });
    } catch (error) {
      // console.log(error);
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

  const mockOptions = ["option 1, option 2, option 3"];

  return (
    <div className="flex flex-col">
      <form
        className="flex justify-between gap-20 px-20 py-10"
        onSubmit={handleCheckinVolunteer}
      >
        <FormInput
          label="Username"
          type="text"
          placeholder="Your Username"
          onChange={(e) => setUserName(e.target.value)}
        />
        <ShiftSelect
          options={mockOptions}
          selectedOption={selectedOption}
          onChange={setSelectedOption}
        />
        <button type="submit" className="min-w-[200px]">
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
