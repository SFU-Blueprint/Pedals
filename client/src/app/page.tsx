import Image from "next/image";

export default function Home() {

	function getTime() {
		return ["Monday", "June", "10", "5:06", "PM"]
	}

	const data = getTime();

  return (
	<nav className="bg-[#E9E9E9]">
		
		<div className="flex flex-row justify-around">
			<div className="flex flex-col">
				<h1 className="font-supplyMono">{data[0]}, {data[1]} {data[2]}</h1>
				<h1 className="font-supplyMono text-[64px]">{data[3]} {data[4]}</h1>
			</div>
			<div>
				<ul className="flex flex-row">
					<li>Check-in</li>
					<li>Register</li>
					<li>Manage</li>
				</ul>
			</div>
		</div>
	</nav>
  );
}
