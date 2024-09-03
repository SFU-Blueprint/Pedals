"use client";

import { FormEvent, useState } from "react";
import VolunteerCard from "../components/VolunteerCard";
import ShiftSelect from "../components/ShiftSelect";
import FormInput from "@/components/FormInput";
import DateSelector from "@/components/DateSelector";

export default function RegisterPage() {
  const [userName, setUserName] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [shiftType, setShiftType] = useState<string | null>(null);
  const [dob, setDOB] = useState<Date | null>(new Date());

  const handleRegisterVolunteer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(userName, shiftType, fullName, userDay, userMonth, userYear);
    try {
      await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          userName,
          shiftType,
          fullName,
          dob
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

  const mockOptions: string[] = ["Option 1", "Option 2", "Option 3"];
  return (
    <div className="flex flex-col">
      <form
        className="flex items-start justify-between gap-40 px-20 py-10"
        onSubmit={handleRegisterVolunteer}
      >
        <div className="flex flex-col gap-3">
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
          <div className="flex justify-start gap-96">
            <FormInput
              className="w-96"
              label="Full Name"
              type="text"
              placeholder="Type"
              onChange={(e) => setFullName(e.target.value)}
            />
            <FormInput label="Date of Birth">
              <DateSelector selected={dob} onChange={(date) => setDOB(date)} />
            </FormInput>
          </div>
        </div>
        <button
          disabled={!userName || !shiftType || !fullName || !dob}
          type="submit"
          className={`mt-[34px] whitespace-nowrap uppercase ${userName && shiftType && fullName && dob ? "!bg-pedals-yellow" : "cursor-not-allowed !bg-transparent"}`}
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
