"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ManageNavBar from "@/components/layouts/ManageNavBar";
import Dropdown from "@/components/Dropdown";
import FormInput from "@/components/FormInput";

function SelectPath({ currentPath }: { currentPath: string }) {
  return (
    <div className="flex gap-2">
      <Link
        href="/manage/shift"
        className={`px-3 py-2 text-lg uppercase hover:bg-pedals-grey ${currentPath === "/manage/shift" ? "bg-yellow-400" : "bg-white"}`}
      >
        Shifts
      </Link>

      <Link
        href="/manage/people"
        className={`px-3 py-2 text-lg uppercase hover:bg-pedals-grey ${currentPath === "/manage/people" ? "!bg-yellow-400" : "bg-white"}`}
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
  const path = usePathname();
  const [searchName, setSearchName] = useState("");
  const [searchMonth, setSearchMonth] = useState<string | null>(null);
  const [searchYear, setSearchYear] = useState<string | null>(null);

  return (
    <div>
      <ManageNavBar className="fixed left-20 top-20" />
      <div className="flex w-full items-center justify-between bg-pedals-lightgrey px-20 pb-10 pt-32">
        <SelectPath currentPath={path} />
        <div className="flex items-center gap-2">
          <FormInput
            className="w-80"
            type="text"
            placeholder="Search Name"
            onChange={(e) => setSearchName(e.target.value)}
          />
          {path === "/manage/shift" && (
            <div className="flex gap-2">
              <Dropdown
                className="w-40"
                options={[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec"
                ]}
                currentOption={searchMonth}
                placeholder="Month"
                onClick={(e) => {
                  e.preventDefault();
                  setSearchMonth((e.target as HTMLButtonElement).value || null);
                }}
              />
              <Dropdown
                className="w-40"
                options={[
                  "2014",
                  "2015",
                  "2016",
                  "2017",
                  "2018",
                  "2019",
                  "2020",
                  "2021",
                  "2022",
                  "2023",
                  "2024"
                ]}
                currentOption={searchYear}
                placeholder="Year"
                onClick={(e) => {
                  e.preventDefault();
                  setSearchYear((e.target as HTMLButtonElement).value || null);
                }}
              />
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
