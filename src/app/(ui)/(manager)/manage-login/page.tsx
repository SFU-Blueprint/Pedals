"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PopUp from "@/components/PopUp";

function IncorrectAccessCodeWarning() {
  return (
    <div className="translate absolute bottom-5 right-1/2 translate-x-1/2 rounded-xl bg-pedals-yellow p-4">
      <Image src="" alt="" />
      <p>Incorrect access code, please try again.</p>
    </div>
  );
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
            <input className="grow" placeholder="TYPE" type="text" />
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
