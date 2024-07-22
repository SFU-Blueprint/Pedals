"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import chevron_left from "./image/chevron-left.svg";
import close_X from "./image/x.svg";
import FormInput from "@/components/FormInput";
import PopUp from "@/components/PopUp";

interface ErrorPopUpProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

export default function ChangeAccessPage() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="h-screen bg-pedals-lightgrey">
      <div className="flex h-full w-fit flex-col justify-center gap-6 px-32">
        <Link
          className="flex items-start gap-2 text-lg font-medium hover:font-bold"
          href="/manage/shift"
        >
          <Image src={chevron_left} alt="Back" />
          <span>BACK</span>
        </Link>

        <FormInput
          label="Current access code:"
          placeholder="TYPE"
          type="text"
        />

        <div>
          <p>Your new code must be between 8-15 characters,</p>
          <p>and must have both numbers and letters.</p>
        </div>

        <FormInput label="New access code:" placeholder="TYPE" type="text" />
        <FormInput
          label="Confirm new access code:"
          placeholder="TYPE"
          type="text"
        />

        <div className="mt-6">
          <button
            type="submit"
            className="flex items-center justify-center !bg-pedals-grey hover:!bg-pedals-yellow"
            onClick={() => setIsOpen(true)}
          >
            CHANGE ACCESS CODE
          </button>
          <PopUp
            title="Change Access Code"
            open={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <div className="flex h-full flex-col justify-around px-10 py-10">
              <div>
                <h3>Test</h3>
              </div>
              <div className="flex w-full justify-between gap-[70px]">
                <button
                  className="!bg-pedals-grey hover:!bg-pedals-yellow"
                  type="submit"
                  onClick={() => setIsOpen(false)}
                >
                  CANCEL
                </button>
                <button
                  className="grow !bg-pedals-grey hover:!bg-pedals-yellow"
                  type="submit"
                  onClick={() => setIsOpen(false)}
                >
                  FINISHED
                </button>
              </div>
            </div>
          </PopUp>
        </div>
      </div>
    </div>
  );
}

/*
<div className="mx-auto flex h-1/2 w-1/2 flex-col rounded-xl bg-pedals-white">
        <div className="flex h-1/4 w-full flex-row items-center justify-between rounded-t-xl bg-pedals-yellow px-10 align-middle">
          <h3> Change Access Code </h3>
          <button
            type="button"
            onClick={() => onClose()}
            className="!bg-transparent"
          >
            <Image src={close_X} alt="Close" />
          </button>
        </div>

        
*/
