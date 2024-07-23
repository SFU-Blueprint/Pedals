"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import chevron_left from "./image/chevron-left.svg";
import close_X from "./image/xclose-x.svg";
import FormInput from "@/components/FormInput";

interface ErrorPopUpProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

function ErrorPopUp({ open, onClose, message }: ErrorPopUpProps) {
  return open ? (
    <div
      className="flex h-full w-full items-center justify-center rounded-xl"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1040,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(15px)"
      }}
    >
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

        <div className="flex h-full flex-col justify-around px-10 py-10">
          <div>
            <h3>{message}</h3>
          </div>
          <div className="flex w-full justify-between gap-[70px]">
            <button
              className="!bg-pedals-grey hover:!bg-pedals-yellow"
              type="submit"
              onClick={onClose}
            >
              CANCEL
            </button>
            <button
              className="grow !bg-pedals-grey hover:!bg-pedals-yellow"
              type="submit"
              onClick={onClose}
            >
              FINISHED
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default function ChangeAccessPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [currCode, setCurrCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [confirmNewCode, setConfirmNewCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (newCode !== confirmNewCode) {
      setMessage("New access codes do not match");
      setIsOpen(true);
      return;
    }

    try {
      const response = await fetch("/api/change-access-code", {
        method: "POST",
        body: JSON.stringify({
          currCode,
          newCode
        })
      });

      const data = await response.json();

      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage("Access code changed successfully");
      }

      setIsOpen(true);
    } catch (error) {
      setMessage("An unknown error occurred");
      setIsOpen(true);
    }
  };

  return (
    <div className="h-screen bg-pedals-lightgrey">
      <div className="flex h-full w-fit flex-col justify-center gap-8 pl-28 pt-16">
        <div className="flex flex-col">
          <Link
            className="group mb-2 flex items-center text-lg font-medium text-pedals-black hover:font-bold hover:text-black"
            href="/manage/shift"
          >
            <Image src={chevron_left} alt="Back" className="" />
            <span className="ml-2 group-hover:text-black">BACK</span>
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <FormInput>Current access code:</FormInput>
          <input
            className="grow"
            placeholder="Current Access Code"
            type="text"
            value={currCode}
            onChange={(e) => setCurrCode(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <p>Your new code must be between 8-15 characters,</p>
          <p>and must have both numbers and letters.</p>
        </div>

        <div className="flex flex-col gap-2">
          <FormInput>New access code:</FormInput>
          <input
            className="grow"
            placeholder="New access code"
            type="text"
            onChange={(e) => setNewCode(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <FormInput>Confirm new access code:</FormInput>
          <input
            className="grow"
            placeholder="Confirm new access code"
            type="text"
            onChange={(e) => setConfirmNewCode(e.target.value)}
            required
          />
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="!bg-pedals-grey hover:!bg-pedals-yellow"
            onClick={handleSubmit}
          >
            CHANGE ACCESS CODE
          </button>
          <ErrorPopUp
            open={isOpen}
            onClose={() => setIsOpen(false)}
            message={message}
          />
        </div>
      </div>
    </div>
  );
}
