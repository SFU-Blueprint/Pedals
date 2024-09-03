"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import VolunteerCard from "../components/VolunteerCard";
import ShiftSelect from "../components/ShiftSelect";

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
      {volunteers.map((item, idx) => (
        <VolunteerCard
          firstName={item.volunteerName.name}
          key={`${idx}`}
          lastName=""
          timeIn="11:10am"
          shift={item.shiftType}
        />
      ))}
    </div>
  );
}
