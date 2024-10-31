import { useId } from "react";

interface RadioButtonProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
}

export default function RadioButton({ label, ...props }: RadioButtonProps) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        checked={props.checked}
        className={`${props.className} h-6 w-6 cursor-pointer appearance-none rounded-full bg-pedals-grey checked:bg-pedals-yellow`}
        onChange={props.onChange}
      />
      <label className="cursor-pointer font-mono uppercase" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
