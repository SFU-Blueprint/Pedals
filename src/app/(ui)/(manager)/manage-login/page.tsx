"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import PopUp from "@/components/PopUp";

// This should be another global components, having 3 levels: Error, Warning, Success, so that other pages can use.
function IncorrectAccessCodeWarning() {
  return (
    <div className="translate absolute bottom-9 right-1/2 flex w-[400px] translate-x-1/2 flex-row justify-evenly rounded-xl bg-pedals-yellow py-4">
      <svg
        width="20"
        className="translate-y-[6px]"
        height="17"
        viewBox="0 0 20 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.24035 1.79773L1.22208 13.5142C1.07738 13.7648 1.00082 14.0489 1.00001 14.3383C0.999196 14.6276 1.07417 14.9121 1.21746 15.1635C1.36076 15.4149 1.56738 15.6244 1.81678 15.7712C2.06617 15.9179 2.34964 15.9968 2.63899 16H16.6755C16.9649 15.9968 17.2484 15.9179 17.4978 15.7712C17.7471 15.6244 17.9538 15.4149 18.0971 15.1635C18.2404 14.9121 18.3153 14.6276 18.3145 14.3383C18.3137 14.0489 18.2372 13.7648 18.0925 13.5142L11.0742 1.79773C10.9265 1.55421 10.7185 1.35287 10.4703 1.21314C10.2221 1.07341 9.94209 1 9.65727 1C9.37245 1 9.09243 1.07341 8.84424 1.21314C8.59606 1.35287 8.38807 1.55421 8.24035 1.79773Z"
          stroke="#252525"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.65723 6.05676V9.37118"
          stroke="#252525"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.65723 12.6855H9.66441"
          stroke="#252525"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p>Incorrect access code, please try again.</p>
    </div>
  );
}

export default function ManagePage() {
  const [currentAccessCode, setCurrentAccessCode] = useState<string>("");
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const router = useRouter();

  const handleWrongAccessCode = () => {
    setIsWarningVisible(true);
    setTimeout(() => setIsWarningVisible(false), 2500);
  };

  const handleAccessCodeSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/validate-access-code", {
      method: "POST",
      body: JSON.stringify({
        accessCodeToCheck: currentAccessCode
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (response.status === 401) {
      handleWrongAccessCode();
    } else if (response.status === 200) {
      router.push("/manage");
    }
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
        <div className="flex flex-row gap-5">
          <input
            className="grow rounded-[3px] px-3 py-2 outline-none focus:ring-2 focus:ring-pedals-yellow focus:ring-offset-1"
            placeholder="TYPE"
            type="password"
            onClick={() => setIsWarningVisible(false)}
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
          className="!bg-transparent !pt-40 !text-left font-mono text-lg text-pedals-darkgrey hover:font-bold hover:text-pedals-black"
          onClick={() => setIsPopupVisible(true)}
        >
          FORGOT PASSWORD?
        </button>
      </form>
      {isPopupVisible && (
        <PopUp title="Password Recovery" close={() => setIsPopupVisible(false)}>
          <div className="flex h-full flex-col justify-around px-10 py-10">
            <div>
              An email has been set to cavan@gmail.com. Please follow the
              instruction in the email to reset your access code.
            </div>
            <div className="flex w-full justify-between gap-[70px]">
              <button
                type="button"
                onClick={() => setIsPopupVisible(false)}
                className="!rounded-3xl !bg-pedals-yellow !px-5"
              >
                CANCEL
              </button>
              <button
                className="grow !rounded-3xl !bg-pedals-lightgrey"
                type="button"
                onClick={() => setIsPopupVisible(false)}
              >
                FINISHED
              </button>
            </div>
          </div>
        </PopUp>
      )}
      {isWarningVisible && <IncorrectAccessCodeWarning />}
    </div>
  ) : (
    <h3 className="flex h-screen items-center px-10 font-semibold">
      To view the Manage page, please use a device with a bigger screen. Thank
      you!
    </h3>
  );
}
