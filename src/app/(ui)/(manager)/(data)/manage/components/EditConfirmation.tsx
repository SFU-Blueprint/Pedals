import { useUIComponentsContext } from "@/contexts/UIComponentsContext";

interface EditConfirmationProps {
  data: [
    { key: string; value: string },
    { key: string; value: string },
    { key: string; value: string },
    { key: string; value: string }
  ];
  onConfirm: () => void;
}

export default function EditConfirmation({
  data,
  onConfirm
}: EditConfirmationProps) {
  const { loading } = useUIComponentsContext();
  const [
    { key: key1, value: value1 },
    { key: key2, value: value2 },
    { key: key3, value: value3 },
    { key: key4, value: value4 }
  ] = data;
  return (
    <div className="flex flex-col items-center gap-10 px-10 py-10">
      <div className="flex w-full justify-start gap-10">
        <div className="w-2/5">
          <p>{key1}</p>
          <h3>{value1}</h3>
        </div>
        <div className="w-2/5">
          <p>{key2}</p>
          <h3>{value2}</h3>
        </div>
      </div>
      <div className="flex w-full justify-start gap-10">
        <div className="w-2/5">
          <p>{key3}</p>
          <h3>{value3}</h3>
        </div>
        <div className="w-2/5">
          <p>{key4}</p>
          <h3>{value4}</h3>
        </div>
      </div>
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
        Confirm
      </button>
    </div>
  );
}
