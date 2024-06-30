"use client";

import React, {
  useState,
  useEffect,
  useRef,
  ComponentPropsWithoutRef
} from "react";

export default function ShiftCard() {
  return (
    <div className="flex w-full justify-between border-y-[1px] border-y-pedals-darkgrey px-16 py-5">
      <h3>John Doe</h3>
      <p className="uppercase">Jun 30, 2024</p>
      <p className="uppercase">12 : 00 pm</p>
      <p className="uppercase">2 : 00 pm</p>
      <p className="uppercase"> WTQ</p>
    </div>
  );
}
