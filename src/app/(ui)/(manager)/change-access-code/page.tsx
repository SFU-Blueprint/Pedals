"use client";

import Link from "next/link";
import React, { FormEvent, useState } from "react";
import FormInput from "@/components/FormInput";
import { useUIComponentsContext } from "@/contexts/UIComponentsContext";
import { FeedbackType } from "@/components/Feedback";
import useFeedbackFetch from "@/hooks/FeedbackFetch";

function ChevronLeft() {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 18.5L9 12.5L15 6.5"
        stroke="#252525"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ChangeAccessCodePage() {
  const [oldCode, setOldCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [confirmNewCode, setConfirmNewCode] = useState("");
  const [success, setSuccess] = useState(false);
  const { setFeedback, loading } = useUIComponentsContext();
  const feedbackFetch = useFeedbackFetch();

  const minCodeLength = 8;
  const maxCodeLength = 15;

  const handleChangeAccessCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    let message = "";
    if (confirmNewCode !== newCode) {
      message = "The new access code and confirmation code do not match.";
    } else if (
      newCode.length < minCodeLength ||
      newCode.length > maxCodeLength
    ) {
      message = `Access code must be ${minCodeLength}-${maxCodeLength} characters long.`;
    } else if (!/\d/.test(newCode) || !/[a-zA-Z]/.test(newCode)) {
      message = "Access code must include at least one letter and one number.";
    }
    if (message) {
      setFeedback({ type: FeedbackType.Warning, message });
    } else {
      await feedbackFetch(
        "/api/access-code",
        {
          method: "PATCH",
          body: JSON.stringify({
            oldCode,
            newCode
          }),
          headers: {
            "Content-Type": "application/json"
          }
        },
        { callback: () => setSuccess(true) }
      );
    }
  };

  return (
    <div className="h-screen bg-pedals-lightgrey">
      <Link
        className="flex items-start gap-2 pl-24 pt-48 font-medium hover:font-bold"
        href="/manage/shift"
      >
        <ChevronLeft />
        <span className="text-lg">BACK</span>
      </Link>
      {success ? (
        <h3 className="pl-24 pt-9">Access Code Successfully Changed</h3>
      ) : (
        <form
          className="flex w-fit flex-col justify-center gap-6 bg-pedals-lightgrey pl-24 pt-9"
          onSubmit={handleChangeAccessCode}
        >
          <FormInput
            label="Current access code:"
            type="password"
            placeholder="TYPE"
            onChange={(e) => setOldCode(e.target.value)}
          />
          <p>
            Your new code must be 8-15 characters long,
            <br />
            and must include both numbers and letters.
          </p>
          <FormInput
            label="New access code:"
            type="password"
            placeholder="TYPE"
            onChange={(e) => setNewCode(e.target.value)}
          />
          <FormInput
            label="Confirm new access code:"
            type="password"
            placeholder="TYPE"
            onChange={(e) => setConfirmNewCode(e.target.value)}
          />
          <button
            type="submit"
            aria-disabled={!oldCode || !newCode || !confirmNewCode || loading}
            className="mt-6 w-fit uppercase"
          >
            Change Access Code
          </button>
        </form>
      )}
    </div>
  );
}
