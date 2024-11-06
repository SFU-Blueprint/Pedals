"use client";

import { FormEvent, useState } from "react";
import FormInput from "@/components/FormInput";
import DateSelector from "@/components/DateSelector";
import useFeedbackFetch from "@/hooks/FeedbackFetch";
import { useUIComponentsContext } from "@/contexts/UIComponentsContext";
import { FeedbackType } from "@/components/Feedback";
import { validFullName, validUsername } from "@/utils/Validators";

export default function RegisterPage() {
  const [username, setUsername] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [dob, setDOB] = useState<Date | null>(null);
  const feedbackFetch = useFeedbackFetch();
  const { setFeedback, setPopup, loading } = useUIComponentsContext();

  const executeRegister = async (
    uname: string,
    fname: string,
    birthdate: Date | null
  ) => {
    await feedbackFetch(
      "/api/register",
      {
        method: "POST",
        body: JSON.stringify({
          uname,
          fname,
          birthdate
        }),
        headers: {
          "Content-Type": "application/json"
        }
      },
      {
        showSuccessFeedback: false,
        callbackOnWarning: false,
        callback: async () => {
          await feedbackFetch("/api/register", {
            method: "PUT",
            body: JSON.stringify({
              uname,
              fname,
              birthdate
            }),
            headers: {
              "Content-Type": "application/json"
            }
          });
        },
        warningPopup: (
          <div className="flex flex-col items-center gap-10 px-10 py-10">
            <p>
              A volunteer with the same name and date of birth already exists in
              the database. Would you like to proceed with the registration? If
              not, please contact your coordinator to verify your existing
              username.
            </p>
            <div className="flex gap-5">
              <button
                type="submit"
                className="!w-fit !bg-pedals-grey px-10 uppercase"
                aria-disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  if (loading) return;
                  setPopup(null);
                  setFeedback(null);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="!w-fit px-10 uppercase"
                aria-disabled={loading}
                onClick={async (e) => {
                  e.preventDefault();
                  if (loading) return;
                  setPopup(null);
                  await feedbackFetch("/api/register", {
                    method: "PUT",
                    body: JSON.stringify({
                      uname,
                      fname,
                      birthdate
                    }),
                    headers: {
                      "Content-Type": "application/json"
                    }
                  });
                }}
              >
                Continue to Register
              </button>
            </div>
          </div>
        )
      }
    );
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!username || !fullName) {
      let message = "";
      if (!username && !fullName) {
        message = "Please provide your username and full name!";
      } else if (!username) {
        message = "Please provide your username!";
      } else if (!fullName) {
        message = "Please provide your full name!";
      }
      setFeedback({
        type: FeedbackType.Warning,
        message
      });
      return;
    }
    if (!validUsername(username)) {
      setFeedback({
        type: FeedbackType.Warning,
        message:
          "Username must be lowercase, alphanumeric, wihout spaces, and fewer than 30 characters."
      });
      return;
    }
    if (!validFullName(fullName)) {
      setFeedback({
        type: FeedbackType.Warning,
        message:
          "Full name must include a first and last name, with no leading, trailing, or multiple spaces."
      });
      return;
    }
    await executeRegister(username, fullName, dob);
  };

  return (
    <form
      className="flex items-start justify-between gap-40 px-20 py-10"
      onSubmit={handleRegister}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-start gap-96">
          <FormInput
            uppercase
            className="w-[25rem]"
            label="Username"
            type="text"
            placeholder="TYPE"
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
          />
          <FormInput
            className="w-[25rem]"
            label="Full Name"
            type="text"
            placeholder="TYPE"
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <FormInput className="w-[25rem]" label="(If Under 24) Date of Birth">
          <DateSelector
            className="w-full"
            selected={dob}
            onChange={(date) => setDOB(date as Date | null)} // Casting from undefined to Date | null to prevent type error
            maxDate={new Date()}
          />
        </FormInput>
      </div>
      <button
        aria-disabled={!username || !fullName || loading}
        type="submit"
        className="mt-[34px] whitespace-nowrap uppercase"
      >
        Register
      </button>
    </form>
  );
}
