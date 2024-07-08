"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManagePage() {
  const router = useRouter();
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
          <p className="pt-40 !font-mono text-pedals-darkgrey hover:font-bold hover:text-pedals-black">
            Forgot Password?
          </p>
        </div>
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
