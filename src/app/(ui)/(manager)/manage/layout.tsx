"use client";

import { useState } from "react";
import Link from "next/link";
import ManageNavBar from "@/components/layouts/ManageNavBar";

function SelectShift({ nav, setNav }: { nav: any; setNav: any }) {
  return (
    <div className="flex gap-2 py-10">
      <Link
        href="/manage/shift"
        className={`bg-white px-3 py-2.5 font-mono text-lg uppercase tracking-wide hover:bg-pedals-grey ${nav === "Shift" ? "!bg-yellow-400" : ""}`}
        onClick={() => setNav("Shift")}
      >
        Shifts
      </Link>

      <Link
        href="/manage/people"
        className={`bg-white px-3 py-2.5 font-mono text-lg uppercase tracking-wide hover:bg-pedals-grey ${nav === "People" ? "!bg-yellow-400" : ""}`}
        onClick={() => setNav("People")}
      >
        People
      </Link>
    </div>
  );
}

export default function ManagerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [nav, setNav] = useState("People");

  return (
    <div>
      <ManageNavBar className="fixed left-20 top-20" />

      <div className="flex w-full justify-between bg-pedals-lightgrey px-20 pt-[100px]">
        <SelectShift nav={nav} setNav={setNav} />

        {nav === "People" && (
          <div className="flex flex-grow items-center justify-end gap-2">
            <input
              className="uppercase"
              type="text"
              placeholder="Search Name"
            />
          </div>
        )}

        {nav === "Shift" && (
          <div className="flex flex-grow items-center justify-end gap-2">
            <input
              className="uppercase"
              type="text"
              placeholder="Search Name"
            />
            <select className="rounded-[3px] bg-white px-3 py-3 font-mono text-lg uppercase">
              <option value="month" className="min-w-[100px]">
                May
              </option>
            </select>
            <select className="rounded-[3px] bg-white px-3 py-3 font-mono text-lg uppercase">
              <option value="year" className="min-w-[100px]">
                2024
              </option>
            </select>
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
