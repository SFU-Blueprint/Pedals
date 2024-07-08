"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

function IncorrectAccessCodeWarning() {
  return (
    <div className="translate absolute bottom-5 right-1/2 translate-x-1/2 rounded-xl bg-pedals-yellow p-4">
      <Image src="" alt="" />
      <p>Incorrect access code, please try again.</p>
    </div>
  );
}

function ForgotPasswordPopUp({
  children,
  open,
  onClose
}: {
  children: React.ReactNode;
  open: boolean;
  onClose: any;
}) {
  if (open) {
    return (
      <div>
        <button type="button" onClick={onClose}>
          hello
        </button>
        {children}
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
            <ForgotPasswordPopUp open={isOpen} onClose={() => setIsOpen(false)}>
              hello
            </ForgotPasswordPopUp>
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
