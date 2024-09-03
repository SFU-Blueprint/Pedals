import Dropdown from "@/components/Dropdown";
import FormInput from "@/components/FormInput";

interface ShiftSelectProps {
  options: string[];
  selectedOption: string | null;
  onChange: (arg: string | null) => void;
  className?: string;
}

export default function ShiftSelect({
  options,
  selectedOption,
  className,
  onChange
}: ShiftSelectProps) {
  return (
    <FormInput className={className} label="Shift Type">
      <div className="flex gap-2">
        <button
          type="button"
          className={`${selectedOption === "pftp" && "!bg-pedals-yellow"}`}
          onClick={() => onChange(selectedOption === "pftp" ? null : "pftp")}
        >
          PFTP
        </button>
        <button
          type="button"
          className={`${selectedOption === "wtq" && "!bg-pedals-yellow"}`}
          onClick={() => onChange(selectedOption === "wtq" ? null : "wtq")}
        >
          WTQ
        </button>
        <Dropdown
          className="w-full"
          options={options}
          currentOption={
            selectedOption && options.includes(selectedOption)
              ? selectedOption
              : null
          }
          onClick={(e) => {
            e.preventDefault();
            onChange((e.target as HTMLButtonElement).value || null);
          }}
        />
      </div>
    </FormInput>
  );
}
