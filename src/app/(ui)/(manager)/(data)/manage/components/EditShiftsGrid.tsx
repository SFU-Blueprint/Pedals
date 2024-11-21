import { Tables } from "@/lib/supabase.types";
import EditShiftCard from "./EditShiftCard";

interface EditShiftsGridProps {
  shifts: Tables<"shifts">[];
  refreshShifts: () => Promise<void>;
}

export default function EditShiftsGrid({
  shifts,
  refreshShifts
}: EditShiftsGridProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="z-10 flex items-center justify-start border-pedals-black px-20 py-2">
        <p className="w-96">Name</p>
        <p className="w-72">Date</p>
        <div className="flex justify-between gap-3">
          <p className="flex w-48 justify-center">Check In</p>
          <p className="flex w-48 justify-center">Check Out</p>
        </div>
        <p className="ml-40">Shift</p>
      </div>
      <div className="h-full overflow-y-scroll border-y-[2px] border-y-pedals-darkgrey bg-pedals-grey">
        {shifts?.map((shift) => (
          <EditShiftCard
            key={shift.id}
            shift={shift}
            refreshShifts={refreshShifts}
          />
        ))}
      </div>
    </div>
  );
}
