import { Tables } from "@/lib/supabase.types";
import useFeedbackFetch from "@/hooks/FeedbackFetch";

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
  const handleCheckout = async (
    shiftId: string,
    volunteerId: string | null
  ) => {
    // propagateFeedback([FeedbackType.Loading, "Loading"]);
    // try {
    //   const response = await fetch("/api/checkout", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       shiftId,
    //       volunteerId
    //     }),
    //     headers: {
    //       "Content-Type": "application/json"
    //     }
    //   });
    //   const data = await response.json();
    //   if (response.status === 200 || response.status === 201) {
    //     await refreshShifts();
    //     propagateFeedback([FeedbackType.Success, data.message]);
    //     if (response.status === 201) {
    //       propagatePopup();
    //     }
    //   } else if (response.status >= 400 && response.status < 500) {
    //     propagateFeedback([FeedbackType.Warning, data.message]);
    //   } else if (response.status >= 500 && response.status < 600) {
    //     propagateFeedback([FeedbackType.Error, data.message]);
    //   }
    // } catch (error) {
    //   propagateFeedback([FeedbackType.Error, "Unknown Error"]);
    // }
    // setTimeout(() => propagateFeedback(null), 2500);
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
