import React from "react";
import FormInput from "@/components/FormInput";

interface RegisterProps {
  fullName: string;
  userDay: number;
  userMonth: number;
  userYear: number;
  setFullName: (value: string) => void;
  setUserDay: (value: number) => void;
  setUserMonth: (value: number) => void;
  setUserYear: (value: number) => void;
}

function Register({
  fullName,
  userDay,
  userMonth,
  userYear,
  setFullName,
  setUserDay,
  setUserMonth,
  setUserYear
}: RegisterProps) {
  return (
    <div>
      <div className="grid grid-cols-5 items-end justify-between gap-20 px-20 py-10">
        <div className="col-span-2 items-end">
          <label className="text-black">Full Name</label>
          <input
            className="w-[90%]"
            // label="Full Name"
            type="text"
            placeholder="Your Name"
            onChange={(e) => setFullName(e.target.value)}
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
              <input
                type="number"
                className="w-1/2"
                placeholder="Day"
                onChange={(e) => setUserDay(Number(e.target.value))}
              />
              <input
                type="number"
                className="w-1/2"
                placeholder="Month"
                onChange={(e) => setUserMonth(Number(e.target.value))}
              />
              <input
                type="number"
                className="w-1/2"
                placeholder="Year"
                onChange={(e) => setUserYear(Number(e.target.value))}
              />
            </div>
          </FormInput>
        </div>
        <div className="col-span-1"></div>
      </div>
    </div>
  );
}

export default Register;
