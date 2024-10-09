import { Tables } from "@/lib/supabase.types";
import { isInMonth, isInYear } from "@/utils";
import { FeedbackType } from "@/components/Feedback";
import EditShiftCard from "./EditShiftCard";

interface EditShiftsGridProps {
  shifts: Tables<"shifts">[];
  refreshShifts: () => Promise<void>;
  propagateFeedback: (feedback: [FeedbackType, string] | null) => void;
  filter: {
    name: string;
    month: string | null;
    year: number | null;
  };
}

export default function EditShiftsGrid({
  shifts,
  refreshShifts,
  filter,
  propagateFeedback
}: EditShiftsGridProps) {
  const filteredShifts = shifts?.filter((shift) => {
    const nameMatch = filter.name
      ? shift.volunteer_name?.toLowerCase().includes(filter.name.toLowerCase())
      : true;
    const monthMatch = filter.month
      ? isInMonth(shift.checked_in_at, shift.checked_out_at, filter.month)
      : true;
    const yearMatch = filter.year
      ? isInYear(shift.checked_in_at, shift.checked_out_at, filter.year)
      : true;
    return nameMatch && monthMatch && yearMatch;
  });

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="z-10 flex items-center justify-start border-b-2 border-pedals-black bg-pedals-lightgrey px-20 py-2">
        <p className="w-96">Name</p>
        <p className="w-72">Date</p>
        <div className="flex justify-between gap-3">
          <p className="flex w-48 justify-center">Check In</p>
          <p className="flex w-48 justify-center">Check Out</p>
        </div>
        <p className="ml-40">Shift</p>
      </div>
      <div className="overflow-y-scroll h-full">
        {filteredShifts?.map((shift) => (
          <EditShiftCard
            key={shift.id}
            shift={shift}
            refreshShifts={refreshShifts}
            propagateFeedback={propagateFeedback}
          />
        ))}
      </div>
    </div>
  );
}
