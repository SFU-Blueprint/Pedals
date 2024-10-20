import { useEffect, useRef, useState } from "react";
import { Tables } from "@/lib/supabase.types";
import DateSelector from "@/components/DateSelector";
import { formatDate } from "@/utils";
import { FeedbackType } from "@/components/Feedback";

interface EditPeopleCardProps {
  person: Tables<"users">;
  refreshPeople: () => Promise<void>;
  onClick: () => void;
  isSelected: boolean;
  propagateFeedback: (feedback: [FeedbackType, string] | null) => void;
}

export default function EditPeopleCard({
  person,
  refreshPeople,
  onClick,
  isSelected,
  propagateFeedback
}: EditPeopleCardProps) {
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

  const handleEditPeople = async (
    personId: string,
    dob: Date | null,
    lastSeen: Date | null
  ) => {
    propagateFeedback([FeedbackType.Loading, "Loading"]);
    try {
      const response = await fetch(`/api/people/${personId}`, {
        method: "PATCH",
        body: JSON.stringify({
          dob: dob ? dob.toISOString() : null,
          last_seen: lastSeen ? lastSeen.toISOString() : null
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (response.status === 200) {
        await refreshPeople();
        propagateFeedback([FeedbackType.Success, data.message]);
      } else {
        propagateFeedback([FeedbackType.Warning, data.message]);
      }
    } catch (error) {
      propagateFeedback([FeedbackType.Error, "Unknown Error"]);
    }
    setTimeout(() => propagateFeedback(null), 2500);
  };

  let background = "bg-pedals-stroke";
  if (isEditing) {
    background = "bg-pedals-lightgrey";
  } else if (isSelected) {
    background = "bg-pedals-grey";
  }

  return (
    <div
      ref={ref}
      className={`edit-card flex w-full justify-between border-y-[1px] border-y-pedals-darkgrey px-20 py-4 ${background}`}
      onClick={() => {
        if (!isEditing) {
          onClick();
        }
      }}
      role="presentation"
    >
      <div className="flex items-center justify-start">
        <h3 className="w-80">{person.name ?? "Error"}</h3>
        <h2 className="w-80">{person.username ?? "Error"}</h2>
        {isEditing ? (
          <div className="-ml-[10px] w-80 pr-4">
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
        className={`!rounded-[30px] !px-12 uppercase ${isEditing && "hover:!bg-pedals-grey"}`}
        onClick={() => {
          if (isEditing) {
            handleEditPeople(person.id, dob, lastSeen);
          }
          setIsEditing(!isEditing);
        }}
      >
        {isEditing ? "Done" : "Edit"}
      </button>
    </div>
  );
}
