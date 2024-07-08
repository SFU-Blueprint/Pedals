"use client";

import { useState } from "react";
import FormInput from "@/components/FormInput";
import Dropdown from "@/components/Dropdown";

function ShiftSelect() {
  const [PFTPState, setPFTPState] = useState<boolean>(false);
  const [WTQState, setWTQState] = useState<boolean>(false);
  const [OptionState, setOptionState] = useState<boolean>(false);

  return (
    <FormInput label="Shift Type">
      <div className="flex gap-2">
        <button
          type="button"
          className={PFTPState ? "!bg-pedals-yellow" : ""}
          onClick={() => {
            if (!PFTPState) {
              setPFTPState(true);
              setWTQState(false);
              setOptionState(false);
            }
          }}
        >
          PFTP
        </button>
        <button
          type="button"
          className={WTQState ? "!bg-pedals-yellow" : ""}
          onClick={() => {
            if (!WTQState) {
              setWTQState(true);
              setPFTPState(false);
              setOptionState(false);
            }
          }}
        >
          WTQ
        </button>
        <Dropdown
          className={OptionState ? "!bg-pedals-yellow" : ""}
          // className="!bg-pedals-yellow"
          options={[
            { value: "option1", label: "OPTION 1" },
            { value: "option2", label: "OPTION 2" },
            { value: "option3", label: "OPTION 3" }
          ]}
          handleOnClick={() => {
            // console.log(e)
            if (!OptionState) {
              setWTQState(false);
              setPFTPState(false);
              setOptionState(true);
            }
          }}
          placeholder="SELECT"
        />
      </div>
    </FormInput>
  );
}

export default function Checkin() {
  return (
    <form className="flex justify-between gap-20 px-20 py-10">
      <FormInput label="Username" type="text" placeholder="TYPE" />
      <ShiftSelect />
      <button type="submit" className="min-w-[200px]">
        Check In
      </button>
    </form>
  );
}

/* Shift Type
          <div className="col-span-3 flex flex-col">
            {" "}
            <h1 className="mb-2 text-[18px]">ShiftName</h1>
            <div className="flex flex-row">
              <button type="button" className="mr-10 bg-white px-3 py-1">
                PFTP
              </button>
              <button type="button" className="mr-10 bg-white px-3 py-1">
                WTQ
              </button>
              <div className="mr-10 flex justify-center bg-white px-3 py-1 align-middle">
                <select className="bg-white">
                  <option> Option 1 </option>
                  <option> Option 2 </option>
                  <option> Option 3 </option>
                </select>
              </div>
            </div>
          </div> */
