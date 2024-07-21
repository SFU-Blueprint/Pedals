import Dropdown from "@/components/Dropdown";
import FormInput from "@/components/FormInput";

interface ShiftSelectProps {
  selectedOption: string | null;
  setSelectedOption: (arg: string | null) => void;
}

export default function ShiftSelect({
  selectedOption,
  setSelectedOption
}: ShiftSelectProps) {
  const dropdownOptions = ["option 1", "option 2", "option 3"];
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <FormInput label="Shift Type">
      <div className="flex gap-2">
        <button
          type="button"
          className={selectedOption === "pftp" ? "!bg-pedals-yellow" : ""}
          onClick={() =>
            setSelectedOption(selectedOption !== "pftp" ? "pftp" : null)
          }
        >
          PFTP
        </button>
        <button
          type="button"
          className={selectedOption === "wtq" ? "!bg-pedals-yellow" : ""}
          onClick={() =>
            setSelectedOption(selectedOption !== "wtq" ? "wtq" : null)
          }
        >
          WTQ
        </button>
        <Dropdown
          options={dropdownOptions}
          currentOption={
            selectedOption && dropdownOptions.includes(selectedOption)
              ? selectedOption
              : null
          }
          onClick={(e) => {
            e.preventDefault();
            setSelectedOption((e.target as HTMLButtonElement).value || null);
          }}
          placeholder="SELECT"
        />
      </div>
    </FormInput>
  );
}
