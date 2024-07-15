"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PopUp from "@/components/PopUp";

function IncorrectAccessCodeWarning() {
  return (
    <div className="translate absolute bottom-9 right-1/2 flex w-[400px] translate-x-1/2 flex-row justify-evenly rounded-xl bg-pedals-yellow py-4">
      <Image
        src="/warning-triangle.svg"
        alt=""
        width={0}
        height={0}
        className="h-auto w-auto"
      />
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
      <div
        className="flex h-full w-full items-center justify-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1040,
          backgroundColor: "rgba(0, 0, 0, 0.25)"
        }}
      >
        <div className="mx-auto flex h-1/2 w-2/5 flex-col rounded-xl !bg-pedals-white font-inter normal-case !text-black">
          <div className="flex h-2/5 w-full flex-row items-center justify-between rounded-t-xl !bg-pedals-yellow px-10 align-middle">
            <h5 className=""> Password Recovery </h5>
            <button
              type="button"
              className="!bg-transparent"
              onClick={() => onClose()}
              aria-label="Close Password Recovery"
            >
              <Image
                src="/close-x.svg"
                alt=""
                width={0}
                height={0}
                className="h-auto w-auto"
              />
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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

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
        <div className="flex h-full w-fit flex-col justify-center gap-3 pl-28 pt-32 uppercase">
          <h1>Enter Access Code</h1>
          <div className="flex flex-row gap-5">
            <input
              className="grow rounded-[3px] px-3 py-2 outline-none focus:ring-2 focus:ring-pedals-yellow focus:ring-offset-1"
              placeholder="TYPE"
              type="password"
            />
            <button
              type="submit"
              className="!bg-pedals-grey !px-16 uppercase hover:!bg-pedals-yellow"
              onClick={() => router.push("/manage")}
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
            <PopUp
              title="Password Recovery"
              open={isOpen}
              onClose={() => setIsOpen(false)}
            >
              <div className="flex h-full flex-col justify-around px-10 py-10">
                <div>
                  An email has been set to cavan@gmail.com. Please follow the
                  instruction in the email to reset your access code.
                </div>
                <div className="flex w-full justify-between gap-[70px]">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="!rounded-3xl !bg-pedals-yellow !px-5"
                  >
                    CANCEL
                  </button>
                  <button
                    className="grow !rounded-3xl !bg-pedals-lightgrey"
                    type="button"
                    onClick={() => setIsOpen(false)}
                  >
                    FINISHED
                  </button>
                </div>
              </div>
            </PopUp>
            <ForgotPasswordPopUp
              open={isOpen}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
        <IncorrectAccessCodeWarning />
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
