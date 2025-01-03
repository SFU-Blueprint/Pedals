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
  const dropdownOptions = options.slice(2);
  return (
    <FormInput className={className} label="Shift Type">
      <div className="flex gap-2">
        <button
          type="button"
          className={`${selectedOption === options[0] && "!bg-pedals-yellow"}`}
          onClick={() =>
            onChange(selectedOption === options[0] ? null : options[0])
          }
        >
          {options[0]}
        </button>
        <button
          type="button"
          className={`${selectedOption === options[1] && "!bg-pedals-yellow"}`}
          onClick={() =>
            onChange(selectedOption === options[1] ? null : options[1])
          }
        >
          {options[1]}
        </button>
        <Dropdown
          className="w-full"
          options={dropdownOptions}
          currentOption={
            selectedOption && dropdownOptions.includes(selectedOption)
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
