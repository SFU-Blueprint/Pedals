"use client";

import FormInput from "@/components/FormInput";
import VolunteerCard from "./components/VolunteerCard";
import ShiftSelect from "./components/ShiftSelect";

export default function Checkin() {
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
        <FormInput label="Username" type="text" placeholder="TYPE" />
        <ShiftSelect />
        <button type="submit" className="min-w-[200px]">
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
