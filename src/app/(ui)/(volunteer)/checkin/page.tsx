"use client";

import { useState } from "react";
import FormInput from "@/components/FormInput";
import VolunteerCard from "./components/VolunteerCard";
import ShiftSelect from "./components/ShiftSelect";
// import Post from "../../../api/checkin/route"

export default function Checkin() {
  const [userName, setUserName] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  async function findVolunteer(e: any) {
    e.preventDefault();
    const shiftType = selectedOption;

    try {
      await fetch("/api/checkin", {
        method: "POST",
        body: JSON.stringify({
          userName,
          shiftType
        })
      });
    } catch (error) {
      // console.log(error);
    }
  }

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
  return (
    <div className="flex flex-col">
      <form className="flex justify-between gap-20 px-20 py-10">
        <FormInput
          label="Username"
          type="text"
          placeholder="TEXT"
          onChange={(e) => setUserName(e.target.value)}
        />
        <ShiftSelect
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <button
          type="submit"
          className="min-w-[200px]"
          onClick={(e) => findVolunteer(e)}
        >
          Check In
        </button>
      </form>
      {mockInfo.map(
        (item: {
          firstName: string;
          lastName: string;
          timeIn: string;
          shift: string;
        }) => (
          <VolunteerCard
            firstName={item.firstName}
            lastName={item.lastName}
            timeIn={item.timeIn}
            shift={item.shift}
          />
        )
      )}
    </div>
  );
}
