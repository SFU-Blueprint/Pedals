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
      <div>
        {" "}
        <form className="grid grid-cols-5 justify-between gap-20 px-20 py-10">
          <div className="col-span-2 items-end">
            <FormInput
              className="w-[90%]"
              label="Full Name"
              type="text"
              placeholder="TYPE"
            />
          </div>
          <div className="col-span-2 items-end">
            <FormInput
              className="flex h-full"
              label="(If under 18) Date of Birth"
              type="text"
              placeholder="TYPE"
            >
              <div className="flex gap-2">
                {" "}
                <input type="text" className="w-1/2" placeholder="Day"></input>
                <input
                  type="text"
                  className="w-1/2"
                  placeholder="Month"
                ></input>
                <input type="text" className="w-1/2" placeholder="Year"></input>
              </div>{" "}
            </FormInput>
          </div>
          <div className="col-span-1"></div>
        </form>
      </div>
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
