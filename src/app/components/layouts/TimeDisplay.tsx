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

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const day = daysOfWeek[currentTime.getDay()];
  const month = months[currentTime.getMonth()];
  const date = currentTime.getDate();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const isAM = hours < 12;
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const period = isAM ? "AM" : "PM";

  return (
    <div className={`${props.className} flex flex-col`}>
      <h2>
        {day}, {month} {date}
      </h2>
      <h1>
        {displayHours}:{displayMinutes} {period}
      </h1>
    </div>
  );
}
