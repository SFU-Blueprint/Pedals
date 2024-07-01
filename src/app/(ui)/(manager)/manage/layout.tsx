"use client";

import { useState } from "react";

import ManageNavBar from "@/components/layouts/ManageNavBar";

export default function ManagerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [nav, setNav] = useState("Shift");

  return (
    <div>
      <ManageNavBar className="fixed left-20 top-20" />
      {nav === "Shift" ? (
        <div className="flex w-full justify-between bg-pedals-lightgrey px-20 pt-[100px]">
          <div className="flex gap-2 py-10">
            <button
              type="button"
              className={`uppercase ${nav === "Shift" ? "!bg-yellow-400" : ""}`}
              onClick={() => setNav("Shift")}
            >
              Shifts
            </button>
            <button
              type="button"
              className={`uppercase ${nav !== "Shift" ? "!bg-yellow-400" : ""}`}
              onClick={() => setNav("People")}
            >
              People
            </button>
          </div>
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
        </div>
      ) : (
        <div>
          <div className="flex w-full justify-between bg-pedals-lightgrey px-20 pt-[100px]">
            <div className="flex gap-2 py-10">
              <button
                type="button"
                className={`uppercase ${nav === "Shift" ? "!bg-yellow-400" : ""}`}
                onClick={() => setNav("Shift")}
              >
                Shifts
              </button>
              <button
                type="button"
                className={`uppercase ${nav === "People" ? "!bg-yellow-400" : ""}`}
                onClick={() => setNav("People")}
              >
                People
              </button>
            </div>
            <div className="flex flex-grow items-center justify-end gap-2">
              <input
                className="uppercase"
                type="text"
                placeholder="Search Name"
              />
            </div>
          </div>
          <div className="flex w-full flex-col bg-pedals-lightgrey">
            <div className="flex w-full items-center px-10">
              <hr
                className="flex-grow bg-gray-300"
                style={{ height: "3px", margin: "0 40px" }}
              />
            </div>
            <div className="flex w-full justify-between px-20 py-2">
              <div className="flex items-center gap-4">
                <label className="font-mono uppercase" htmlFor="select-all">
                  <input
                    type="radio"
                    name="options"
                    value="option1"
                    className="mr-2"
                  />
                  Select All
                </label>
                <label className="font-mono uppercase" htmlFor="inactive">
                  <input
                    type="radio"
                    name="options"
                    value="option2"
                    className="mr-2"
                  />
                  Inactive
                </label>
              </div>
              <button
                type="submit"
                className="rounded-[30px] bg-yellow-400 uppercase"
              >
                Remove from database
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
