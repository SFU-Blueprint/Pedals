import React from "react";

interface VolunteerCardProps {
  firstName: string;
  lastName: string;
  timeIn: string;
  shift: string;
}

// Don't use global button-checkout for this
export default function VolunteerCard({
  firstName,
  lastName,
  timeIn,
  shift
}: VolunteerCardProps) {
  return (
    <div className="flex items-center justify-between border-[1px] border-pedals-stroke bg-pedals-grey px-20 py-2">
      <p className="w-4/12">
        {firstName} {lastName}
      </p>
      <p className="w-1/12">{timeIn}</p>
      <p className="w-1/12">{shift}</p>
      <button type="button" className="button-checkout w-2/12">
        Check Out
      </button>
    </div>
  );
}
