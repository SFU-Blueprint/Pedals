import React from "react";

export default function RadioMultiple({
  label,
  value,
  isSelected,
  onChange,
}: {
  label: string;
  value: string;
  isSelected: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
          isSelected ? "bg-yellow-400 border-yellow-400" : "bg-pedals-grey border-pedals-grey"
        }`}
        onClick={() => onChange(value)}
      >
        {isSelected && <div className="w-2 h-2 bg-yellow-400 rounded-full" />}
      </div>
      <span className="font-mono uppercase">{label}</span>
    </label>
  );
}
