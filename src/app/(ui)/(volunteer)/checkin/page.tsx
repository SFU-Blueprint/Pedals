"use client";

import FormInput from "@/components/FormInput";
import VolunteerCard from "./components/VolunteerCard";
import ShiftSelect from "./components/ShiftSelect";
// import Post from "../../../api/checkin/route"

export default function Checkin() {
  async function findVolunteer(formData: FormData) {
    const userName = formData.get("Username");

    try {
      await fetch("/api/checkin", {
        method: "POST",
        body: JSON.stringify({
          userName
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
      <form
        className="flex justify-between gap-20 px-20 py-10"
        action={findVolunteer}
      >
        <FormInput label="Username" type="text" placeholder="TEXT" />
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
