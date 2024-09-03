"use client";

import { useState, FormEvent, useEffect } from "react";
import FormInput from "@/components/FormInput";
import VolunteerCard from "./components/VolunteerCard";
import ShiftSelect from "./components/ShiftSelect";
import { useRouter } from "next/navigation";

interface CheckInAPIProps {
  id: string;
  shiftType: string;
  volunteerName: {
    name: string;
  };
}

export default function Checkin() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [shiftType, setShiftType] = useState<string | null>(null);
  const [volunteers, setVolunteers] = useState<CheckInAPIProps[]>([]);

  const handleCheckinVolunteer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userName,
          shiftType
        })
      });

      if (response.status === 401) {
        // Do something when not success
      } else if (response.status === 200) {
        // Do something when success
        console.log("Success");
        location.reload();
      }
    } catch (error) {
      // Something related to the network error
    }
  };

  const mockOptions = ["option 1", "option 2", "option 3"];

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/checkin", {
        method: "GET"
      });
      const shifts = await response.json();
      setVolunteers(shifts.data);
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

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
          selectedOption={shiftType}
          onChange={setShiftType}
          className="col-span-2"
        />
        <button type="submit" className="min-w-[200px]">
          Check In
        </button>
      </form>
      {volunteers.map((item, idx) => (
        <VolunteerCard
          firstName={item.volunteerName.name}
          key={`${idx}`}
          lastName={""}
          timeIn={"11:10am"}
          shift={item.shiftType}
        />
      ))}
    </div>
  );
}
