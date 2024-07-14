"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import Vector from "./image/chevron-left.svg";

export default function ChangeAccessPage() {
  return (
    <div className="h-screen bg-pedals-lightgrey">
      <div className="flex h-full w-fit flex-col justify-center gap-8 pl-28 pt-16">
        <div className="flex flex-col">
          <Link
            className="group mb-2 flex items-center text-lg font-medium text-pedals-black hover:text-black hover:font-bold"
            href="/manage/shift"
          >
            <Image
              src={Vector}
              alt="Back"
              className=""
            />
            <span className="ml-2 group-hover:text-black">BACK</span>
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <p>Current access code:</p>
          <input className="grow" placeholder="TYPE" type="text" />
        </div>

        <div className="flex flex-col">
          <p>Your new code must be between 8-15 characters,</p>
          <p>and must have both numbers and letters.</p>
        </div>

        <div className="flex flex-col gap-2">
          <p>New access code:</p>
          <input className="grow" placeholder="TYPE" type="text" />
        </div>

        <div className="flex flex-col gap-2">
          <p>Confirm new access code:</p>
          <input className="grow" placeholder="TYPE" type="text" />
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="!bg-pedals-grey hover:!bg-pedals-yellow"
          >
            CHANGE ACCESS CODE
          </button>
        </div>
      </div>
    </div>
  );
}

