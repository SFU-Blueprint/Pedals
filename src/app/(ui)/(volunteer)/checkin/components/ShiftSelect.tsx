import Dropdown from "@/components/Dropdown";
import FormInput from "@/components/FormInput";

interface ShiftSelectProps {
  options: string[];
  selectedOption: string | null;
  onChange: (arg: string | null) => void;
}

export default function ShiftSelect({
  options,
  selectedOption,
  onChange
}: ShiftSelectProps) {
  return (
    <FormInput label="Shift Type">
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
          placeholder="SELECT"
        />
      </div>
    </FormInput>
  );
}
