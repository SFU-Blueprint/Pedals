"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

function ForgotPasswordPopUp({
  open,
  onClose
}: {
  open: boolean;
  onClose: any;
}) {
  if (open) {
    return (
      <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-20">
        <div className="mx-auto flex h-1/2 w-2/5 flex-col rounded-xl !bg-pedals-white font-inter normal-case !text-black">
          <div className="flex h-2/5 w-full flex-row items-center justify-between rounded-t-xl !bg-pedals-yellow px-10 align-middle">
            <h5 className=""> Password Recovery </h5>
            <button
              type="button"
              className="!bg-transparent"
              onClick={() => onClose()}
              aria-label="Close Password Recovery"
            >
              <svg
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M34.5 11.5L11.5 34.5"
                  stroke="#252525"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.5 11.5L34.5 34.5"
                  stroke="#252525"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex h-full flex-col justify-around px-10 py-10">
            <div>
              An email has been set to cavan@gmail.com. Please follow the
              instruction in the email to reset your access code.
            </div>
            <div className="flex w-full justify-between gap-[70px]">
              <button
                type="button"
                onClick={onClose}
                className="!rounded-3xl !bg-pedals-yellow !px-5"
              >
                CANCEL
              </button>
              <button
                className="grow !rounded-3xl !bg-pedals-lightgrey"
                type="button"
                onClick={onClose}
              >
                FINISHED
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function ManagePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [accessCodeToCheck, setaccessCodeToCheck] = useState<string>("");
  const router = useRouter();

  const handleWrongAccessCode = (e: any) => {
    setIsWarningVisible(true);
    e.preventDefault();
    setTimeout(() => setIsWarningVisible(false), 2500);
  };

  async function handleAccessCodeSubmission(e: any) {
    e.preventDefault();
    const response = await fetch("/api/validate-access-code", {
      method: "POST",
      body: JSON.stringify({
        accessCodeToCheck
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (response.status === 200) {
      router.push("/manage");
    }
    if (response.status === 401) {
      handleWrongAccessCode(e);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLargeScreen) {
    return (
      <div className="h-screen bg-pedals-lightgrey">
        <form
          className="flex h-full w-fit flex-col justify-center gap-3 pl-28 pt-32 uppercase"
          method="post"
          onSubmit={(e) => handleAccessCodeSubmission(e)}
        >
          <h1>Enter Access Code</h1>
          <div className="flex flex-row gap-5">
            <input
              className="grow rounded-[3px] px-3 py-2 outline-none focus:ring-2 focus:ring-pedals-yellow focus:ring-offset-1"
              placeholder="TYPE"
              type="password"
              onClick={() => setIsWarningVisible(false)}
              onChange={(e) => setaccessCodeToCheck(e.target.value)}
            />
            <button
              type="submit"
              className="!bg-pedals-grey !px-16 uppercase hover:!bg-pedals-yellow"
            >
              Go
            </button>
          </div>
          <div className="pt-40 font-mono text-lg text-pedals-darkgrey">
            <button
              type="button"
              className="!bg-transparent hover:font-bold hover:text-pedals-black"
              onClick={() => setIsOpen(true)}
            >
              FORGOT PASSWORD?
            </button>
            <ForgotPasswordPopUp
              open={isOpen}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </form>
        {isWarningVisible && <IncorrectAccessCodeWarning />}
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center">
      <h3 className="px-10 font-semibold">
        To view the Manage page, please use a device with a bigger screen. Thank
        you!
      </h3>
    </div>
  );
}
