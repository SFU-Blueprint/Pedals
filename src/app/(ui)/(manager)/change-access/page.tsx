"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import chevron_left from "./image/chevron-left.svg";
import close_X from "./image/xclose-x.svg";

interface ErrorPopUpProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

function ErrorPopUp({ open, onClose, message }: ErrorPopUpProps) {
  return open ?
    <div className="flex h-full w-full items-center justify-center rounded-xl"
         style={{
           position: "fixed",
           top: 0,
           left: 0,
           zIndex: 1040,
           backgroundColor: "rgba(0, 0, 0, 0.4)",
           backdropFilter: "blur(15px)"
         }}
    >
      <div className="flex flex-col mx-auto bg-pedals-white w-1/2 h-1/2 rounded-xl">

        <div className="flex flex-row h-1/4 w-full bg-pedals-yellow justify-between align-middle items-center px-10 rounded-t-xl">
          <h3> Change Access Code </h3>
          <button type="button" onClick={() => onClose()} className="!bg-transparent">
            <Image src={close_X} alt="Close"/>
          </button>
        </div>

        <div className="flex flex-col h-full px-10 py-10 justify-around">
          <div>
            <h3>{message}</h3>
          </div>
          <div className="flex w-full justify-between gap-[70px]">
            <button className="!bg-pedals-grey hover:!bg-pedals-yellow" type="submit" onClick={onClose}>
              CANCEL
            </button>
            <button className="grow !bg-pedals-grey hover:!bg-pedals-yellow" type="submit" onClick={onClose}>
              FINISHED
            </button>
          </div>
        </div>
      </div>
    </div>
    : null
}


export default function ChangeAccessPage() {
  const [isOpen, setIsOpen] = useState(false);
  return (
      <div className="h-screen bg-pedals-lightgrey">
        <div className="flex h-full w-fit flex-col justify-center gap-8 pl-28 pt-16">
          <div className="flex flex-col">
            <Link
                className="group mb-2 flex items-center text-lg font-medium text-pedals-black hover:text-black hover:font-bold"
                href="/manage/shift"
            >
              <Image
                  src={chevron_left}
                  alt="Back"
                  className=""
              />
              <span className="ml-2 group-hover:text-black">BACK</span>
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <p>Current access code:</p>
            <input className="grow" placeholder="Current Access Code" type="text"/>
          </div>

          <div className="flex flex-col">
            <p>Your new code must be between 8-15 characters,</p>
            <p>and must have both numbers and letters.</p>
          </div>

          <div className="flex flex-col gap-2">
            <p>New access code:</p>
            <input className="grow" placeholder="New access code" type="text" />
          </div>

          <div className="flex flex-col gap-2">
            <p>Confirm new access code:</p>
            <input className="grow" placeholder="Confirm new access code" type="text" />
          </div>

          <div className="mt-8">
            <button
                type="submit"
                className="!bg-pedals-grey hover:!bg-pedals-yellow"
                onClick={() => setIsOpen(true)}
            >
              CHANGE ACCESS CODE
            </button>
            <ErrorPopUp open={isOpen} onClose={() => setIsOpen(false) } message="Failed to change access code, please make sure your inputs are valid" />
          </div>
        </div>
      </div>
  );
}
