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
  open,
  onClose
}: {
  open: boolean;
  onClose: any;
}) {
  if (open) {
    return (
      <div className="flex h-full w-full items-center justify-center"
		style={{
					position: "fixed",
					top: 0,
					left: 0,
					zIndex: 1040,
					backgroundColor: "rgba(0, 0, 0, 0.4)",
					backdropFilter: "blur(15px)"
				}}
		>
		<div className="flex flex-col mx-auto !bg-pedals-white w-1/2 h-1/2">

			<div className="flex flex-row h-1/4 w-full !bg-pedals-yellow justify-between align-middle items-center px-10 !text-black">
				<h5 className=""> Password Recovery </h5>
				<h5 className="" onClick={() => onClose()}>X</h5>
			</div>

			<div className="flex flex-col h-full px-10 py-10 justify-around">
				<div>
					An email has been set to cavan@gmail.com/Please follow jthe instruction in the email to reset your access code.
				</div>
				<div className="flex w-full justify-between gap-[100px]">
					<button type="button" onClick={onClose}>
					  CANCEL
					</button>
					<button className="grow" type="button" onClick={onClose}>
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
            <ForgotPasswordPopUp open={isOpen} onClose={() => setIsOpen(false)}/>
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
