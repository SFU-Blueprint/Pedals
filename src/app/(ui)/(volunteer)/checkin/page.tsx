"use client";

import FormInput from "@/components/FormInput";
import VolunteerCard from "./components/VolunteerCard";
import ShiftSelect from "./components/ShiftSelect";
import Register from "./components/Register";

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
      <form className="grid grid-cols-5 gap-20 px-20">
        <div className="col-span-2">
          {" "}
          <FormInput
            className="w-[90%]"
            label="Username"
            type="text"
            placeholder="TYPE"
          />
        </div>

        <ShiftSelect className="col-span-2" />
        <div className="align-end justify- col-span-1 flex items-end justify-items-center">
          <button type="submit" className="w-[60%] min-w-[200px]">
            Check In
          </button>
        </div>
      </form>

      <Register></Register>
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
