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

      <div className="flex flex-row w-full justify-between">

        <ul className="flex flex-row items-end">
          <li className="flex flex-col">
            <h1 className="text-[18px]">Username</h1>
            <input type="text" className="rounded-[3px]" />
          </li>
          <li className="m-3">
            <button type="button">PFTP</button>
          </li>
          <li className="m-3">
            <button type="button">WTQ</button>
          </li>
          <li className="m-3">
            <select>
				<option> Option 1 </option>
				<option> Option 2 </option>
				<option> Option 3 </option>
			</select>
          </li>
			<button 
				type="button"
				className="bg-[#FFD030] rounded-[30px] text-[24px] font-supplyMonoRegular"
			>
				Check In
			</button>
        </ul>


      </div>
    </nav>
  );
}
