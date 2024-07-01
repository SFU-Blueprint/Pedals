import React, { useId } from "react";

interface VolunteerProps {
  firstName: String;
  lastName: String;
  timeIn: String; //Todo: Change to DateTime Object
  id: any;
}

export default function Volunteer({
  firstName,
  lastName,
  timeIn,
  id
}: VolunteerProps) {
  return (
    <div className="flex items-center justify-between border-[1px] border-[#BBBBBB] bg-[#D6D6D6] px-20 py-2">
      {/* Name */}
      <div className="w-4/12 flex-initial">
        <p>
          {firstName} {lastName}
        </p>
      </div>

      {/* Time */}
      <div className="w-1/12 flex-initial">
        {" "}
        <p>{timeIn}</p>
      </div>

      {/* Pftp */}
      <div className="w-1/12 flex-initial">
        <p>PFTP</p>
      </div>

      {/* Button */}
      <div className="w-2/12 flex-initial">
        {" "}
        <button type="submit" className="min-w-[200px]">
          Check Out
        </button>
      </div>
    </div>
  );
}
