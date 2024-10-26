import { Tables } from "@/lib/supabase.types";
import useFeedbackFetch from "@/hooks/FeedbackFetch";
import { useUIComponentsContext } from "@/contexts/UIComponentsContext";

interface ActiveShiftsGridProps {
  shifts: Tables<"shifts">[];
  refreshShifts: () => Promise<void>;
}

interface ActiveShiftCardProps {
  shift: Tables<"shifts">;
  refreshShifts: () => Promise<void>;
}

function ActiveShiftCard({ refreshShifts, shift }: ActiveShiftCardProps) {
  const feedbackFetch = useFeedbackFetch();
  const { loading } = useUIComponentsContext();
  const executeCheckout = async (
    shiftId: string,
    volunteerId: string | null
  ) => {
    await feedbackFetch(
      "api/checkout",
      {
        method: "POST",
        body: JSON.stringify({
          shiftId,
          volunteerId
        }),
        headers: {
          "Content-Type": "application/json"
        }
      },
      {
        callback: async () => refreshShifts(),
        warningPopup: (
          <p className="px-10 py-10">
            Your shift has been marked as checked out. However, the checkout
            date does not match the check-in date. Please notify the coordinator
            to update the shift details manually.
          </p>
        )
      }
    );
  };
  return (
    <div className="flex w-full items-center justify-between border-y-[1px] border-pedals-stroke bg-pedals-grey px-20 py-3">
      <div className="flex justify-start gap-96">
        <h3 className="w-[25rem]">{shift.volunteer_name}</h3>
        <div className="flex w-[25rem] justify-between">
          <p>
            `Since $
            {new Date(shift.checked_in_at).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true
            })}
            `
          </p>
          <p className="uppercase">{shift.shift_type}</p>
        </div>
      </div>
      <button
        type="button"
        aria-disabled={loading}
        className="!rounded-full !px-5 uppercase"
        onClick={() => {
          if (!loading) {
            executeCheckout(shift.id, shift.volunteer_id);
          }
        }}
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
    <div className="flex h-full flex-col overflow-y-scroll bg-pedals-grey">
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
