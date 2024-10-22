"use client";

import { ReactNode } from "react";

interface PopUpProps extends React.ComponentPropsWithoutRef<"div"> {
  title: string;
  closeAction: () => void;
}

export interface PopupInterface {
  title: string;
  component: ReactNode;
}

export default function Popup({ title, closeAction, ...props }: PopUpProps) {
  return (
    <div
      className={`${props.className} flex h-screen w-screen items-center justify-center bg-pedals-black bg-opacity-25`}
    >
      <div className="flex h-fit w-2/5 flex-col rounded-xl bg-pedals-white">
        <div className="flex h-fit w-full items-center justify-between rounded-t-xl bg-pedals-yellow px-10 py-10">
          <h3>{title}</h3>
          <button
            type="button"
            className="h-4 w-4 !bg-transparent !p-0"
            onClick={closeAction}
            aria-label="Close"
          >
            <svg
              className="h-full w-full"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L17 17"
                stroke="#252525"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 17L17 1"
                stroke="#252525"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {props.children}
      </div>
    </div>
  );
}
