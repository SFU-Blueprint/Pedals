"use client";

import { FormEvent, useState } from "react";
import VolunteerCard from "./components/VolunteerCard";
import ShiftSelect from "./components/ShiftSelect";
import Register from "./components/Register";
// import Post from "../../../api/register/route";

export default function RegisterPage() {
  const [userName, setUserName] = useState<string>("j");
  const [fullName, setFullName] = useState<string>("");
  // Birthday
  const [userDay, setUserDay] = useState<number>(0);
  const [userMonth, setUserMonth] = useState<number>(0);
  const [userYear, setUserYear] = useState<number>(0);
  const [shiftType, setSelectedOption] = useState<string | null>(null);

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
          dob: `${userDay}/${userMonth}/${userYear}`
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
      <form onSubmit={handleRegisterVolunteer}>
        <div className="grid grid-cols-5 items-end gap-20 px-20">
          <div className="col-span-2">
            {" "}
            <label htmlFor="username" className="text-black">
              Username
            </label>
            <input
              id="username"
              // label="Username"
              className="w-[90%]"
              type="text"
              placeholder="Your Username"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          {/* {userName} */}

          <ShiftSelect
            className="col-span-2 justify-end"
            options={mockOptions}
            selectedOption={shiftType}
            onChange={setSelectedOption}
          />
          <div className="align-end justify- col-span-1 flex items-end justify-items-center">
            <button type="submit" className="w-[60%] min-w-[200px]">
              Check In
            </button>
          </div>
        </div>

        <Register
          fullName={fullName}
          userDay={userDay}
          userMonth={userMonth}
          userYear={userYear}
          setFullName={setFullName}
          setUserDay={setUserDay}
          setUserMonth={setUserMonth}
          setUserYear={setUserYear}
        ></Register>
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
