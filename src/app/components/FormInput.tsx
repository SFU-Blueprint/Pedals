import { useId } from "react";

interface FormInputProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
  uppercase?: boolean;
}

export default function FormInput({
  label,
  uppercase,
  ...props
}: FormInputProps) {
  const id = useId();
  return (
    <div className={`${props.className} flex flex-col`}>
      {label && (
        <label className="mb-1.5 text-pedals-black" htmlFor={id}>
          {label}
        </label>
      )}
      {props.children ?? (
        <input
          className={`${uppercase && "uppercase"}`}
          id={id}
          name={label}
          type={props.type}
          placeholder={props.placeholder}
          value={props.value}
          onClick={props.onClick}
          onChange={props.onChange}
        />
      )}
    </div>
  );
}
