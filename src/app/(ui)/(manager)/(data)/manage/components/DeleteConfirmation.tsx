import { useUIComponentsContext } from "@/contexts/UIComponentsContext";
import { formatDate } from "@/utils/DateTime";

interface DeleteConfirmationProps {
  data: { id: string; name: string; lastSeen: string }[];
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmation({
  data,
  onCancel,
  onConfirm
}: DeleteConfirmationProps) {
  const { loading } = useUIComponentsContext();
  return (
    <div className="flex flex-col items-center gap-5 px-10 py-10">
      <div className="flex w-full justify-start gap-10 px-5">
        <p className="w-2/5">Name</p>
        <p className="w-2/5">Last Seen</p>
      </div>
      <div className="mb-[20px] max-h-[222px] w-full overflow-y-auto">
        {data.map((person) => (
          <div
            key={person.id}
            className="edit-card flex w-full justify-start gap-10 border-y-[1px] border-pedals-stroke bg-pedals-grey px-5 py-5"
          >
            <h3 className="w-2/5">{person.name}</h3>
            <p className="w-2/5 uppercase">
              {formatDate(new Date(person.lastSeen))}
            </p>
          </div>
        ))}
      </div>
      <div className="flex w-full justify-between">
        <button
          type="submit"
          className="!w-fit !bg-pedals-grey px-10"
          aria-disabled={loading}
          onClick={(e) => {
            e.preventDefault();
            if (loading) return;
            onCancel();
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="!w-fit px-10"
          aria-disabled={loading}
          onClick={(e) => {
            e.preventDefault();
            if (loading) return;
            onConfirm();
          }}
        >
          Remove from Database
        </button>
      </div>
    </div>
  );
}
