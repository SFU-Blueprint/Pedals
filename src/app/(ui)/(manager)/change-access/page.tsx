"use client";

import Link from "next/link";

export default function ChangeAccessPage() {
  return (
    <div className="h-screen bg-pedals-lightgrey">
      <div className="flex h-full w-fit flex-col justify-center gap-8 pl-28 pt-16">
        <div className="flex flex-col">
          <Link
            className="text-lg font-medium flex items-center text-pedals-darkgrey hover:text-pedals-yellow mb-2"
            href="/manage-login"
          >
            <span className="text-3xl mr-2 ml-2 mb-[0.425rem]">&lt;</span> BACK
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <p>Current access code:</p>
          <input
            className="rounded-sm px-3 py-0.5"
            placeholder="TYPE"
          />
        </div>

        <div className="flex flex-col">
          <p>Your new code must be between 8-15 characters,</p>
          <p>and must have both numbers and letters.</p>
        </div>

        <div className="flex flex-col gap-2">
          <p>New access code:</p>
          <input
            className="rounded-sm px-3 py-0.5"
            placeholder="TYPE"
          />
        </div>

        <div className="flex flex-col gap-2">
          <p>Confirm new access code:</p>
          <input
            className="rounded-sm px-3 py-0.5"
            placeholder="TYPE"
          />
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
