"use client";

import Link from "next/link";
import React, { FormEvent, useState } from "react";
import FormInput from "@/components/FormInput";
import Feedback, { FeedbackType } from "@/components/Feedback";

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
  const [feedback, setFeedback] = useState<[FeedbackType, string] | null>(null);
  const [success, setSuccess] = useState(false);

  const minCodeLength = 8;
  const maxCodeLength = 15;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (confirmNewCode !== newCode) {
      setFeedback([
        FeedbackType.Warning,
        "New access code and confirmation access code do not match."
      ]);
    } else if (
      newCode.length < minCodeLength ||
      newCode.length > maxCodeLength
    ) {
      setFeedback([
        FeedbackType.Warning,
        "The access code length must be between 8 and 15 characters."
      ]);
    } else if (!/\d/.test(newCode) || !/[a-zA-Z]/.test(newCode)) {
      setFeedback([
        FeedbackType.Warning,
        "The code must contain at least one letter and one number."
      ]);
    } else {
      setFeedback([FeedbackType.Loading, "Loading"]);
      try {
        const response = await fetch("/api/change-access-code", {
          method: "POST",
          body: JSON.stringify({
            oldCode,
            newCode
          }),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        if (response.status === 200) {
          setFeedback([FeedbackType.Success, data.message]);
          setSuccess(true);
        } else if (response.status >= 400 && response.status < 500) {
          setFeedback([FeedbackType.Warning, data.message]);
        } else if (response.status >= 500 && response.status < 600) {
          setFeedback([FeedbackType.Error, data.message]);
        }
      } catch (error) {
        setFeedback([FeedbackType.Error, "Unknown Error"]);
      }
    }
    setTimeout(() => setFeedback(null), 2500);
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
          onSubmit={handleSubmit}
        >
          <FormInput
            label="Current access code:"
            type="password"
            placeholder="TYPE"
            onChange={(e) => setOldCode(e.target.value)}
          />
          <p>
            Your new code must be between 8-15 characters,
            <br />
            and must have both numbers and letters.
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
            disabled={!oldCode || !newCode || !confirmNewCode}
            className="mt-6 w-fit uppercase"
          >
            Change Access Code
          </button>
        </form>
      )}
      {feedback && <Feedback type={feedback[0]}>{feedback[1]}</Feedback>}
    </div>
  );
}
