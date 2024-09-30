"use client";

import { useEffect, useRef, useState } from "react";
import DateSelector from "@/components/DateSelector";
import { Tables } from "@/lib/supabase.types";
import { formatDate } from "@/utils";

interface EditPeopleGridProps {
  people: Tables<"users">[];
  refreshPeople: () => Promise<void>;
  filter: {
    name: string;
  };
}

interface EditPeopleCardProps {
  person: Tables<"users">;
  refreshPeople: () => Promise<void>;
}

function EditPeopleCard({ person, refreshPeople }: EditPeopleCardProps) {
  const [dob, setDob] = useState<Date | null>(
    person.dob ? new Date(person.dob) : null
  );
  const [lastSeen, setLastSeen] = useState<Date | null>(
    person.last_seen ? new Date(person.last_seen) : null
  );
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`edit-card flex w-full justify-between border-y-[1px] border-y-pedals-darkgrey px-20 py-4 ${isEditing ? "bg-pedals-lightgrey" : "bg-pedals-stroke"}`}
    >
      <div className="flex items-center justify-start">
        <h3 className="w-80">{person.name ?? "Error"}</h3>
        <h2 className="w-80">{person.username ?? "Error"}</h2>
        {isEditing ? (
          <div className="w-80 pr-4">
            <DateSelector selected={dob} onChange={(d) => setDob(d)} />
          </div>
        ) : (
          <p className="w-80 pr-4">{formatDate(dob)}</p>
        )}
        {isEditing ? (
          <div className="w-80 pr-4">
            <DateSelector
              selected={lastSeen}
              onChange={(d) => setLastSeen(d)}
            />
          </div>
        ) : (
          <p className="w-80">{formatDate(lastSeen)}</p>
        )}
      </div>
      <button
        type="button"
        className="!rounded-[30px] !px-12 uppercase"
        onClick={() => {
          setIsEditing(!isEditing);
        }}
      >
        {isEditing ? "Done" : "Edit"}
      </button>
    </div>
  );
}

export default function EditPeopleGrid({
  people,
  refreshPeople,
  filter
}: EditPeopleGridProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="sticky flex items-center justify-start px-20 py-2">
        <p className="w-80">Name</p>
        <p className="w-80">Username</p>
        <p className="w-80">Date of Birth</p>
        <p className="w-80">Last Seen</p>
        <p className="ml-[340px]">Total</p>
      </div>
      <div className="overflow-y-scroll">
        {people
          ?.filter((person) =>
            filter.name
              ? person.name?.toLowerCase().includes(filter.name.toLowerCase())
              : true
          )
          ?.map((person) => (
            <EditPeopleCard
              key={person.id}
              person={person}
              refreshPeople={refreshPeople}
            />
          ))}
      </div>
    </div>
  );
}
