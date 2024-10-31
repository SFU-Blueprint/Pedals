import { useEffect, useRef, useState } from "react";
import { Tables } from "@/lib/supabase.types";
import DateSelector from "@/components/DateSelector";
import { formatDate } from "@/utils/DateTime";
import FormInput from "@/components/FormInput";
import useFeedbackFetch from "@/hooks/FeedbackFetch";
import { useUIComponentsContext } from "@/contexts/UIComponentsContext";
import EditConfirmation from "./EditConfirmation";
import { FeedbackType } from "@/components/Feedback";
import { validUsername } from "@/utils/Validators";

interface EditPeopleCardProps {
  person: Tables<"users">;
  refreshPeople: () => Promise<void>;
  selectedIDs: Set<string>;
  setSelectedIDs: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function EditPeopleCard({
  person,
  refreshPeople,
  selectedIDs,
  setSelectedIDs
}: EditPeopleCardProps) {
  const [username, setUsername] = useState<string>(person.username);
  const [dob, setDOB] = useState<Date | null>(
    person.dob ? new Date(person.dob) : null
  );
  const [lastSeen, setLastSeen] = useState<Date | null>(
    new Date(person.last_seen)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const feedbackFetch = useFeedbackFetch();
  const { setFeedback, setPopup, loading, popup } = useUIComponentsContext();

  const executeEditPeople = async (
    id: string,
    uname: string,
    birthdate: Date | null,
    lastdate: Date
  ) => {
    await feedbackFetch(
      `/api/people/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          uname,
          birthdate,
          lastdate
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
          setIsHighlighted(true);
          setTimeout(() => setIsHighlighted(false), 3000);
        }
      }
    );
  };

  const isDataUnchanged = () =>
    username === person.username &&
    ((dob === null && person.dob === null) ||
      (dob !== null &&
        person.dob !== null &&
        dob.getTime() === new Date(person.dob).getTime())) &&
    lastSeen?.getTime() === new Date(person.last_seen).getTime();

  const showMissingFieldsWarning = () => {
    const missingFields = [];
    if (!username) missingFields.push("username");
    if (!lastSeen) missingFields.push("last seen date");
    let message = "Please provide ";
    if (missingFields.length === 1) {
      message += missingFields[0];
    } else {
      message += `${missingFields
        .slice(0, -1)
        .join(", ")} and ${missingFields.slice(-1)}`;
    }
    setFeedback({
      type: FeedbackType.Warning,
      message: `${message}!`
    });
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedIDs(new Set());
    if (loading) return;
    if (isEditing) {
      if (isDataUnchanged()) {
        setFeedback({
          type: FeedbackType.Success,
          message: "No changes were made!"
        });
        setIsEditing(false);
        return;
      }
      if (username && lastSeen) {
        if (!validUsername(username)) {
          setFeedback({
            type: FeedbackType.Warning,
            message:
              "Username must be lowercase, alphanumeric, wihout spaces, and fewer than 30 characters."
          });
        } else {
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
                  executeEditPeople(person.id, username, dob, lastSeen)
                }
              />
            )
          });
        }
      } else {
        showMissingFieldsWarning();
      }
    } else {
      setIsEditing(!isEditing);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !loading &&
        !popup
      ) {
        setIsEditing(false);
        setUsername(person.username);
        setDOB(person.dob ? new Date(person.dob) : null);
        setLastSeen(new Date(person.last_seen));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [person.username, person.dob, person.last_seen, loading, popup]);

  let background = "bg-pedals-grey";
  if (isEditing || isHighlighted) {
    background = "bg-pedals-lightgrey";
  } else if (selectedIDs.has(person.id)) {
    background = "bg-pedals-stroke";
  }

  return (
    <div
      ref={ref}
      className={`edit-card flex w-full justify-between border-y-[1px] border-y-pedals-darkgrey px-20 py-4 ${background}`}
      onClick={() => {
        if (!isEditing) {
          setSelectedIDs((prev) => {
            const newSelectedIDs = new Set(prev);
            if (newSelectedIDs.has(person.id)) {
              newSelectedIDs.delete(person.id);
            } else {
              newSelectedIDs.add(person.id);
            }
            return newSelectedIDs;
          });
        }
      }}
      role="presentation"
    >
      <div className="flex items-center justify-start">
        <h3 className="w-80">{person.name}</h3>
        {isEditing ? (
          <FormInput
            uppercase
            type="text"
            className="-ml-[12px] mr-[12px] w-80 pr-10"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        ) : (
          <p className="w-80 uppercase">{username}</p>
        )}
        {isEditing ? (
          <div className="-ml-[12px] w-80 pr-4">
            <DateSelector
              selected={dob}
              onChange={(d) => setDOB(d as Date | null)}
            />
          </div>
        ) : (
          <p className="w-80 pr-4 uppercase">{formatDate(dob)}</p>
        )}
        {isEditing ? (
          <div className="w-80 pr-4">
            <DateSelector
              selected={lastSeen}
              onChange={(d) => setLastSeen(d as Date | null)}
            />
          </div>
        ) : (
          <p className="w-80 uppercase">{formatDate(lastSeen)}</p>
        )}
      </div>
      <button
        aria-disabled={loading}
        type="button"
        className={`!rounded-[30px] !px-12 uppercase ${isEditing && "hover:!bg-pedals-grey"}`}
        onClick={handleButtonClick}
      >
        {isEditing ? "Done" : "Edit"}
      </button>
    </div>
  );
}
