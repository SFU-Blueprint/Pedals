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
  const [isCtrlKeyDown, setIsCtrlKeyDown] = useState(false);
  const [pivot, setPivot] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setIsShiftKeyDown(true);
      }
      if (event.key === "Control" || event.key === "Meta") {
        setIsCtrlKeyDown(true);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setIsShiftKeyDown(false);
      }
      if (event.key === "Control" || event.key === "Meta") {
        setIsCtrlKeyDown(false);
      }
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
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
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
    } else if (isCtrlKeyDown) {
      setSelectedIDs((prev) =>
        prev.includes(filteredPeople[index].id)
          ? prev.filter((id) => id !== filteredPeople[index].id)
          : [...prev, filteredPeople[index].id]
      );
      setPivot(index);
    } else {
      setSelectedIDs([filteredPeople[index].id]);
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
      <div className="overflow-y-scroll">
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
