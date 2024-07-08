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

    // Set the initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLargeScreen) {
    return (
      <div className="h-screen bg-pedals-lightgrey">
        <div className="flex h-full w-fit flex-col justify-center gap-3 pl-28 pt-32">
          <h1 className="">ENTER ACCESS CODE</h1>
          <div className="flex flex-row gap-5">
            <input className="grow" placeholder="TYPE" type="text" />
            <button
              type="submit"
              className="!bg-pedals-grey !px-16 hover:!bg-pedals-yellow"
              onClick={() => router.push("/manage")}
            >
              GO
            </button>
          </div>
          <div className="pt-40 font-mono text-lg text-pedals-darkgrey">
            <span className="hover:font-bold hover:text-pedals-black">
              FORGOT PASSWORD?
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen place-content-center items-center">
      <h3 className="px-10 font-semibold">
        To view the Manage page, please use a device with a bigger screen. Thank
        you!
      </h3>
    </div>
  );
}
