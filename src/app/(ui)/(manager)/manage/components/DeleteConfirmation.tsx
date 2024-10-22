import { formatDate } from "@/utils";

interface DeleteConfirmationProps {
  data: { id: string; name: string; lastSeen: string | null }[];
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmation({
  data,
  onCancel,
  onConfirm
}: DeleteConfirmationProps) {
  return (
    <div className="flex flex-col items-center gap-5 px-10 py-10">
      <div className="flex w-full justify-start gap-10 px-5">
        <p className="w-2/5">Name</p>
        <p className="w-2/5">Last Seen</p>
      </div>
      <div className="max-h-[222px] w-full overflow-y-auto">
        {data.map((person) => (
          <div
            key={person.id}
            className="edit-card flex w-full justify-start gap-10 border-y-[1px] border-pedals-stroke bg-pedals-grey px-5 py-5"
          >
            <h3 className="w-2/5">{person.name}</h3>
            <p className="w-2/5 uppercase">
              {formatDate(person.lastSeen ? new Date(person.lastSeen) : null)}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-5">
        <button
          type="submit"
          className="!w-fit !bg-pedals-grey px-10 uppercase"
          onClick={(e) => {
            e.preventDefault();
            onCancel();
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="!w-fit px-10 uppercase"
          onClick={(e) => {
            e.preventDefault();
            onConfirm();
          }}
        >
          Remove from Database
        </button>
      </div>
    </div>
  );
}
