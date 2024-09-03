import { useId } from "react";

interface FormInputProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
}

export default function FormInput({ label, ...props }: FormInputProps) {
  const id = useId();
  return (
    <div className={`${props.className} flex flex-col gap-1.5`}>
      {label && (
        <label className="text-pedals-black" htmlFor={id}>
          {label}
        </label>
      )}
      {props.children || (
        <input
          className="uppercase"
          id={id}
          type={props.type}
          placeholder={props.placeholder}
          name={label}
          onClick={props.onClick}
          onChange={props.onChange}
        />
      )}
    </div>
  );
}
