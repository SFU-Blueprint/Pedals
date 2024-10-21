import { useEffect, useRef, useState } from "react";
import { Tables } from "@/lib/supabase.types";
import EditPeopleCard from "./EditPeopleCard";

interface EditPeopleGridProps {
  people: Tables<"users">[];
  refreshPeople: () => Promise<void>;
  selectedIDs: string[];
  setSelectedIDs: React.Dispatch<React.SetStateAction<string[]>>;
  filter: {
    name: string;
    inactive: boolean;
    under18: boolean;
  };
}

export default function EditPeopleGrid({
  people,
  refreshPeople,
  selectedIDs,
  setSelectedIDs,
  filter
}: EditPeopleGridProps) {
  const filteredPeople = people?.filter((person) =>
    filter.name
      ? person.name?.toLowerCase().includes(filter.name.toLowerCase())
      : true
  );
  const [isShiftKeyDown, setIsShiftKeyDown] = useState(false);
  const [pivot, setPivot] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      setIsShiftKeyDown(event.key === "Shift" && event.type === "keydown");
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        selectedIDs.length > 0
      ) {
        setSelectedIDs([]);
        setPivot(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);
    document.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKey);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedIDs.length, setSelectedIDs]);

  const handleCardClick = (index: number) => {
    if (isShiftKeyDown && pivot !== null) {
      const newSelected = (
        index < pivot
          ? filteredPeople.slice(index, pivot + 1)
          : filteredPeople.slice(pivot, index + 1)
      ).map((p) => p.id);
      setSelectedIDs(newSelected);
    } else {
      setSelectedIDs((prev) =>
        prev.includes(filteredPeople[index].id)
          ? prev.filter((id) => id !== filteredPeople[index].id)
          : [...prev, filteredPeople[index].id]
      );
      setPivot(index);
    }
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
        {filteredPeople?.map((person, index) => (
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
