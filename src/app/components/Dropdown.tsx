"use client";

import React, {
  useState,
  useEffect,
  useRef,
  ComponentPropsWithoutRef
} from "react";

interface DropdownProps extends ComponentPropsWithoutRef<"button"> {
  options: string[] | number[];
  currentOption: string | number | null;
  placeholder?: string;
  centerParentFix?: string;
}

function DropdownArrow() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="#252525"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Dropdown({
  options,
  currentOption,
  placeholder = "Select",
  centerParentFix,
  ...props
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickInside = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen(!isOpen);
    if (props.onClick) {
      props.onClick(event);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`${props.className} relative`} ref={dropdownRef}>
      {isOpen ? (
        <div
          className={`${centerParentFix} absolute z-50 w-full rounded-[3px] bg-white outline-none ring-2 ring-pedals-yellow ring-offset-1`}
        >
          <button
            type="button"
            className="flex w-full items-center justify-between uppercase hover:bg-pedals-grey"
            onClick={handleClickInside}
          >
            {placeholder}
            <DropdownArrow />
          </button>
          {options.map((option) => (
            <button
              type="button"
              key={option}
              value={option}
              onClick={handleClickInside}
              className={`flex w-full items-center justify-start uppercase ${option === currentOption && "font-bold"}`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          className={`flex w-full items-center justify-between uppercase hover:ring-2 hover:ring-pedals-yellow hover:ring-offset-1 ${currentOption ? "!bg-pedals-yellow" : ""}`}
          onClick={() => setIsOpen(true)}
        >
          {currentOption ?? placeholder}
          <DropdownArrow />
        </button>
      )}
    </div>
  );
}
