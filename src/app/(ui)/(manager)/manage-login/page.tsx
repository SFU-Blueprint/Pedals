"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import useFeedbackFetch from "@/hooks/FeedbackFetch";
import { useUIComponentsContext } from "@/contexts/UIComponentsContext";

export default function ManageLoginPage() {
  const [currentAccessCode, setCurrentAccessCode] = useState<string>("");
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const router = useRouter();
  const feedbackFetch = useFeedbackFetch();
  const { setPopup, loading } = useUIComponentsContext();

  const handleSubmitAccessCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    await feedbackFetch(
      "/api/access-code",
      {
        method: "POST",
        body: JSON.stringify({
          code: currentAccessCode
        }),
        headers: {
          "Content-Type": "application/json"
        }
      },
      { callback: () => router.push("/manage/shift") }
    );
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
    <div className="mx-28 mt-80 h-full">
      <form
        className="flex h-full w-fit flex-col justify-center gap-3 uppercase"
        onSubmit={handleSubmitAccessCode}
      >
        <h1>Enter Access Code</h1>
        <div className="flex items-center gap-5">
          <FormInput
            className="w-full"
            placeholder="TYPE"
            type="password"
            onChange={(e) => setCurrentAccessCode(e.target.value)}
          />
          <button
            aria-disabled={!currentAccessCode || loading}
            type="submit"
            className="!px-16"
          >
            Go
          </button>
        </div>
        <button
          type="button"
          className="mt-40 !h-fit w-fit !bg-transparent !pl-0 font-mono text-lg text-pedals-darkgrey hover:font-bold hover:text-pedals-black"
          onClick={() =>
            setPopup({
              title: "Password Recovery",
              component: (
                <div className="flex h-full flex-col items-center justify-between gap-10 px-10 py-10">
                  <p>
                    An email has been sent to coordinator@gmail.com. Please
                    follow the instructions in the email to reset your access
                    code.
                  </p>
                  <button
                    className="!w-fit !px-10"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      setPopup(null);
                    }}
                  >
                    Finished
                  </button>
                </div>
              )
            })
          }
        >
          Forgot Password?
        </button>
      </form>
    </div>
  ) : (
    <h3 className="mx-28 mt-80 font-semibold">
      To view the Manage page, please use a device with a bigger screen. Thank
      you!
    </h3>
  );
}
