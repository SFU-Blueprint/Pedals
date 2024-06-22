export default function Home() {
  function getTime() {
    const currentTime = new Date();
    let daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    let currentDay = daysOfWeek[currentTime.getDay()];

    // Get current month (0 = January, 1 = February, ..., 11 = December)
    let monthsOfYear = [
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

    let currentMonth = monthsOfYear[currentTime.getMonth()];
    let hour = currentTime.getHours();
    let minute = currentTime.getMinutes();

    let period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;
    let formattedTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

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
    <nav className="bg-[#E9E9E9]">
      <div className="flex flex-row justify-around">

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
            <li className = "m-4 font-supplyMonoRegular text-nowrap hover:font-bold">Check-in</li>
            <li className = "m-4 font-supplyMonoRegular text-nowrap hover:font-bold">Register</li>
            <li className = "m-4 font-supplyMonoRegular text-nowrap hover:font-bold">Manage</li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
