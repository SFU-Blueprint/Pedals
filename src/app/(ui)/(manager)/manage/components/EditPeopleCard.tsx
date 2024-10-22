import { useEffect, useRef, useState } from "react";
import { Tables } from "@/lib/supabase.types";
import DateSelector from "@/components/DateSelector";
import { formatDate } from "@/utils";
import FormInput from "@/components/FormInput";
import useFeedbackFetch from "@/hooks/FeedbackFetch";
import { useUIComponentsContext } from "@/contexts/UIComponentsContext";
import EditConfirmation from "./EditConfirmation";

interface EditPeopleCardProps {
  person: Tables<"users">;
  refreshPeople: () => Promise<void>;
  onClick: () => void;
  isSelected: boolean;
}

export default function EditPeopleCard({
  person,
  refreshPeople,
  onClick,
  isSelected
}: EditPeopleCardProps) {
  const [dob, setDob] = useState<Date | null>(
    person.dob ? new Date(person.dob) : null
  );
  const [lastSeen, setLastSeen] = useState<Date | null>(
    person.last_seen ? new Date(person.last_seen) : null
  );
  const [username, setUsername] = useState<string>(person.username);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const feedbackFetch = useFeedbackFetch();
  const { setPopup } = useUIComponentsContext();

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
    uname: string,
    dateOfBirth: Date | null,
    dateLastSeen: Date | null
  ) => {
    await feedbackFetch(
      `/api/people/${personId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          uname,
          dateOfBirth,
          dateLastSeen
        }),
        headers: {
          "Content-Type": "application/json"
        }
      },
      {
        callback: async () => {
          await refreshPeople();
          setPopup(null);
          setIsEditing(false);
        }
      }
    );
  };

  let background = "bg-pedals-grey";
  if (isEditing) {
    background = "bg-pedals-lightgrey";
  } else if (isSelected) {
    background = "bg-pedals-stroke";
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
        {isEditing ? (
          <FormInput
            uppercase
            type="text"
            className="-ml-[10px] mr-[10px] w-80 pr-10"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        ) : (
          <p className="w-80 uppercase">{username}</p>
        )}
        {isEditing ? (
          <div className="-ml-[10px] w-80 pr-4">
            <DateSelector selected={dob} onSelect={(d) => setDob(d)} />
          </div>
        ) : (
          <p className="w-80 pr-4 uppercase">
            {formatDate(dob, { nullText: "" })}
          </p>
        )}
        {isEditing ? (
          <div className="w-80 pr-4">
            <DateSelector
              selected={lastSeen}
              onSelect={(d) => setLastSeen(d)}
            />
          </div>
        ) : (
          <p className="w-80 uppercase">{formatDate(lastSeen)}</p>
        )}
      </div>
      <button
        type="button"
        className={`!rounded-[30px] !px-12 uppercase ${isEditing && "hover:!bg-pedals-grey"}`}
        onClick={() => {
          if (isEditing) {
            if (username && lastSeen) {
              setPopup({
                title: "Confirm new volunteer details",
                component: (
                  <EditConfirmation
                    data={[
                      {
                        key: "Name",
                        value: person.name
                      },
                      {
                        key: "Username",
                        value: username
                      },
                      {
                        key: "Date of Birth",
                        value: formatDate(dob)
                      },
                      {
                        key: "Last Seen",
                        value: formatDate(lastSeen)
                      }
                    ]}
                    onConfirm={() =>
                      handleEditPeople(person.id, username, dob, lastSeen)
                    }
                  />
                )
              });
            }
          } else {
            setIsEditing(!isEditing);
          }
        }}
      >
        {isEditing ? "Done" : "Edit"}
      </button>
    </div>
  );
}
