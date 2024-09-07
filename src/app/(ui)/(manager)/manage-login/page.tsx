"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Popup from "@/components/Popup";
import Feedback, { FeedbackType } from "@/components/Feedback";
import FormInput from "@/components/FormInput";

export default function ManageLoginPage() {
  const [currentAccessCode, setCurrentAccessCode] = useState<string>("");
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [feedback, setFeedback] = useState<[FeedbackType, string] | null>(null);
  const router = useRouter();

  const handleFeedback = () => {
    if (feedback) {
      setTimeout(() => setFeedback(null), 2500);
    }
  };
  const closePopUpAction = () => setIsPopupVisible(false);
  const handleAccessCodeSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: standardize method to make request and handle response
    try {
      const response = await fetch("/api/validate-access-code", {
        method: "POST",
        body: JSON.stringify({
          accessCode: currentAccessCode
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        setFeedback([FeedbackType.Success, "Success"]);
        router.push("/manage");
      } else {
        setFeedback([FeedbackType.Error, "Incorrect Access Code"]);
      }
    } catch (error) {
      setFeedback([FeedbackType.Error, "Network Error"]);
    }
    handleFeedback();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isLargeScreen ? (
    <div className="h-screen bg-pedals-lightgrey">
      <form
        className="flex h-full w-fit flex-col justify-center gap-3 pl-28 pt-32 uppercase"
        method="post"
        onSubmit={handleAccessCodeSubmission}
      >
        <h1>Enter Access Code</h1>
        <div className="flex items-center gap-5">
          <FormInput
            className="w-full"
            placeholder="TYPE"
            type="password"
            onClick={() => setFeedback(null)}
            onChange={(e) => setCurrentAccessCode(e.target.value)}
          />
          <button
            type="submit"
            className="!bg-pedals-grey !px-16 uppercase hover:!bg-pedals-yellow"
          >
            Go
          </button>
        </div>
        <button
          type="button"
          className="mt-40 !h-fit w-fit !bg-transparent !pl-0 font-mono text-lg text-pedals-darkgrey hover:font-bold hover:text-pedals-black"
          onClick={() => setIsPopupVisible(true)}
        >
          FORGOT PASSWORD?
        </button>
      </form>
      {isPopupVisible && (
        <Popup title="Password Recovery" closeAction={closePopUpAction}>
          <div className="flex h-full flex-col justify-around px-10 py-10">
            <p>
              An email has been set to cavan@gmail.com. Please follow the
              instruction in the email to reset your access code.
            </p>
            <div className="flex w-full justify-between gap-[50px]">
              <button
                type="button"
                onClick={closePopUpAction}
                className="basis-1/3 !rounded-3xl !bg-pedals-yellow !px-5"
              >
                CANCEL
              </button>
              <button
                className="basis-2/3 !rounded-3xl !bg-pedals-lightgrey"
                type="button"
                onClick={closePopUpAction}
              >
                FINISHED
              </button>
            </div>
          </div>
        </Popup>
      )}
      {feedback && <Feedback type={feedback[0]}>{feedback[1]}</Feedback>}
    </div>
  ) : (
    <h3 className="flex h-screen items-center px-10 font-semibold">
      To view the Manage page, please use a device with a bigger screen. Thank
      you!
    </h3>
  );
}
