"use client";

import { useState, useEffect, ComponentPropsWithoutRef } from "react";

export default function TimeDisplay({
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className={`${props.className} flex flex-col`}>
      <h2>
        {currentTime.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric"
        })}
      </h2>
      <h1>
        {currentTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true
        })}
      </h1>
    </div>
  );
}
