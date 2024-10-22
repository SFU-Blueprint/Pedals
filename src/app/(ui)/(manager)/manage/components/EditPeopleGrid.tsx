import { useEffect, useRef } from "react";
import { Tables } from "@/lib/supabase.types";
import EditPeopleCard from "./EditPeopleCard";

interface EditPeopleGridProps {
  people: Tables<"users">[];
  refreshPeople: () => Promise<void>;
  selectedIDs: string[];
  setSelectedIDs: React.Dispatch<React.SetStateAction<string[]>>;
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
        selectedIDs.length > 0
      ) {
        setSelectedIDs([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedIDs.length, setSelectedIDs]);

  const handleCardClick = (index: number) => {
    setSelectedIDs((prev) =>
      prev.includes(people[index].id)
        ? prev.filter((id) => id !== people[index].id)
        : [...prev, people[index].id]
    );
  };

  return (
    <div className="flex h-full select-none flex-col overflow-y-auto" ref={ref}>
      <div className="z-10 flex items-center justify-start border-b-2 border-pedals-black bg-pedals-lightgrey px-20 py-2">
        <p className="w-80">Name</p>
        <p className="w-80">Username</p>
        <p className="w-80">Date of Birth</p>
        <p className="w-80">Last Seen</p>
        <p className="ml-[340px]">{`Total: ${people.length}`}</p>
      </div>
      <div className="h-full overflow-y-scroll">
        {people?.map((person, index) => (
          <EditPeopleCard
            key={person.id}
            person={person}
            refreshPeople={refreshPeople}
            onClick={() => handleCardClick(index)}
            isSelected={selectedIDs.includes(person.id)}
          />
        ))}
      </div>
    </div>
  );
}
