import { Tables } from "@/lib/supabase.types";

interface ActiveShiftsGridProps {
  shifts: Tables<"shifts">[];
  refreshShifts: () => Promise<void>;
}

interface ActiveShiftCardProps {
  shift: Tables<"shifts">;
  refreshShifts: () => Promise<void>;
}

function ActiveShiftCard({ refreshShifts, shift }: ActiveShiftCardProps) {
  const handleCheckout = async (
    shiftId: string,
    volunteerId: string | null
  ) => {
    try {
      const response = await fetch("/api/checkout", {
        method: "PATCH",
        body: JSON.stringify({
          shiftId,
          volunteerId
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        await refreshShifts();
        // This will be handoff to Terry for feedback popup
      } else {
        // This will be handoff to Terry for feedback popup
      }
    } catch (error) {
      // This will be handoff to Terry for feedback popup
    }
  };
  return (
    <div className="flex w-full items-center justify-between border-y-[1px] border-pedals-stroke bg-pedals-grey px-20 py-3">
      <div className="flex justify-start gap-96">
        <h3 className="w-96">{shift.volunteer_name}</h3>
        <div className="flex w-96 justify-between">
          <p>
            {shift.checked_in_at
              ? `Since ${new Date(shift.checked_in_at).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                  }
                )}`
              : "Error"}
          </p>
          <p className="uppercase">{shift.shift_type}</p>
        </div>
      </div>
      <button
        type="button"
        className="!rounded-full !px-5 uppercase"
        onClick={() => handleCheckout(shift.id, shift.volunteer_id)}
      >
        Check Out
      </button>
    </div>
  );
}

export default function ActiveShiftsGrid({
  shifts,
  refreshShifts
}: ActiveShiftsGridProps) {
  return (
    <div className="flex h-full flex-col bg-pedals-grey">
      {shifts?.map((shift) => (
        <ActiveShiftCard
          key={shift.id}
          shift={shift}
          refreshShifts={refreshShifts}
        />
      ))}
    </div>
  );
}
