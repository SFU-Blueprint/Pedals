"use client";

import React, {
  useState,
  useEffect,
  useRef,
  ComponentPropsWithoutRef
} from "react";

type Option = {
  label: string;
  value: string | number;
};

interface DropdownProps extends ComponentPropsWithoutRef<"div"> {
  options: Option[];
  placeholder: string;
}

export default function Dropdown({
  options,
  placeholder,
  ...props
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: Option | null) => {
    setSelectedOption(option);
    setIsOpen(false);
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
      {!isOpen ? (
        <button
          type="button"
          className="flex w-60 items-center justify-between uppercase hover:ring-2 hover:ring-pedals-yellow hover:ring-offset-1"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
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
        </button>
      ) : (
        <div className="absolute flex w-60 flex-col items-start rounded-[3px] bg-white outline-none ring-2 ring-pedals-yellow ring-offset-1">
          <button
            type="button"
            className="flex w-full items-center justify-between uppercase hover:bg-pedals-grey"
            onClick={() => handleOptionClick(null)}
          >
            {placeholder}
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
          </button>
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className="flex w-full items-center justify-start uppercase"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
