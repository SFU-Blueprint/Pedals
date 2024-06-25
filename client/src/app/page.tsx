export default function Home() {
  function getTime() {
    const currentTime = new Date();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    const currentDay = daysOfWeek[currentTime.getDay()];


    // Get current month (0 = January, 1 = February, ..., 11 = December)
    const monthsOfYear = [
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

    const currentMonth = monthsOfYear[currentTime.getMonth()];
    let hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const period = hour >= 12 ? "PM" : "AM";
    hour %= 12;
    hour = hour || 12;
    const formattedTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

    return [
      currentDay,
      currentMonth,
      currentTime.getDate(),
      formattedTime,
      period
    ];
  }

  const data = getTime();

  return (
    <nav className="w-full bg-[#E9E9E9]">
      <div className="mx-20 flex flex-col justify-start pb-10 pt-20">
        <div className="mb-7 flex flex-row justify-between">
          <div className="flex flex-col text-start">
            <h1 className="font-supplyMono text-[24px]">
              {data[0]}, {data[1]} {data[2]}
            </h1>
            <h1 className="font-supplyMono text-[64px]">
              {data[3]} {data[4]}
            </h1>
          </div>

          <div>
            <ul className="flex w-[50%] flex-row justify-between">
              <li className="m-4 text-nowrap font-supplyMonoRegular hover:font-bold">
                Check-in
              </li>
              <li className="m-4 text-nowrap font-supplyMonoRegular hover:font-bold">
                Register
              </li>
              <li className="m-4 text-nowrap font-supplyMonoRegular hover:font-bold">
                Manage
              </li>
            </ul>
          </div>
        </div>
        {/* Container */}
        <div className="grid grid-cols-7">
          {/* Username */}
          <div className="col-span-2">
            <h1 className="mb-2 text-[18px]">Username</h1>{" "}
            <input type="text" placeholder="TYPE" className="rounded-[3px]" />
          </div>

          {/* Shift Type */}
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
          </div>

          {/* Check In */}
          <div className="col-span-2 flex justify-self-end">
            <button
              type="button"
              className="self-end rounded-[50px] bg-[#FFD030] px-5 font-supplyMonoRegular text-[20px]"
            >
              Check In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
