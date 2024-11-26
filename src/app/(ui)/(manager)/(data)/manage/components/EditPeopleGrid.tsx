import { useEffect, useRef } from "react";
import { Tables } from "@/lib/supabase.types";
import EditPeopleCard from "./EditPeopleCard";

interface EditPeopleGridProps {
  people: Tables<"users">[];
  refreshPeople: () => Promise<void>;
  selectedIDs: Set<string>;
  setSelectedIDs: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function EditPeopleGrid({
  people,
  refreshPeople,
  selectedIDs,
  setSelectedIDs
}: EditPeopleGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        (event.target as HTMLElement).textContent !== "Select All" && // Fix for double toggle issue
        selectedIDs.size > 0
      ) {
        setSelectedIDs(new Set());
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedIDs.size, setSelectedIDs]);

  return (
    <div className="flex h-full select-none flex-col overflow-y-auto" ref={ref}>
      <div className="z-10 flex items-center justify-start border-pedals-black border-b-[2px] bg-white px-20 py-2">
        <p className="w-80">Name</p>
        <p className="w-80">Username</p>
        <p className="w-80">Date of Birth</p>
        <p className="w-80">Last Seen</p>
        <p className="ml-[340px]">{`Total: ${people.length}`}</p>
      </div>
      <div className="h-full overflow-y-scroll bg-pedals-grey">
        {people?.map((person) => (
          <EditPeopleCard
            key={person.id}
            person={person}
            refreshPeople={refreshPeople}
            setSelectedIDs={setSelectedIDs}
            selectedIDs={selectedIDs}
          />
        ))}
      </div>
    </div>
  );
}
