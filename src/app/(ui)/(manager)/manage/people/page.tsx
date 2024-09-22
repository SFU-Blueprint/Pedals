"use client";

import { useState } from "react";
import FormInput from "@/components/FormInput";
import RadioMultiple from "@/components/RadioMultiple";

export default function ManagePeoplePage() {
  const [searchName, setSearchName] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleChange = (value: string) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((option) => option !== value)
        : [...prevSelected, value]
    );
  }
  return (
    <>
      <FormInput
        className="ml-auto flex w-80 pr-20 pt-36"
        type="text"
        placeholder="Search Name"
        onChange={(e) => setSearchName(e.target.value)}
      />
      <div className="flex w-full flex-col bg-pedals-lightgrey pt-6">
        <div className="flex w-full items-center px-10">
          <hr
            className="flex-grow bg-gray-300"
            style={{ height: "3px", margin: "0 40px" }}
          />
        </div>
        <div className="flex w-full justify-between px-20 py-2">
          <div className="flex items-center gap-4">
            <RadioMultiple
              label="Select All"
              value="Select All"
              isSelected={selectedOptions.includes("Select All")}
              onChange={handleChange}
            />
            <RadioMultiple
              label="Inactive"
              value="Inactive"
              isSelected={selectedOptions.includes("Inactive")}
              onChange={handleChange}
            />
            <RadioMultiple
              label="Under 18"
              value="Under 18"
              isSelected={selectedOptions.includes("Under 18")}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-yellow-400 uppercase"
          >
            Remove from database
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between bg-pedals-grey px-16 py-2">
        <div className="text-center">Name</div>
        <div className="text-center">Username</div>
        <div className="text-center">Date of Birth</div>
        <div className="text-center">Last Seen</div>
        <div className="text-center">Total</div>
      </div>
    </>
  );
}
