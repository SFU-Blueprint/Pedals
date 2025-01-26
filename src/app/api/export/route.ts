import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { formatDate, formatDuration } from "@/utils/DateTime";
import { Tables } from "@/lib/supabase.types";

interface VolunteerShiftReport {
	username: string;
	name: string;
	total_wtq_time: number;
	total_ptft_time: number;
	total_other_time: number;
	[key: string]: any; // Allow dynamic properties like `total_wtq_time_${monthName}`
}

const monthMap: Record<string, number> = {
	January: 1,
	February: 2,
	March: 3,
	April: 4,
	May: 5,
	June: 6,
	July: 7,
	August: 8,
	September: 9,
	October: 10,
	November: 11,
	December: 12
};

const getDaysInMonth = (month: number, year: number): number =>
	new Date(year, month, 0).getDate();

async function CavanExcelFormat(
	jsonData: { [key: string]: Array<VolunteerShiftReport> | null },
	monthRange: string[],
	year: number
): Promise<string> {
	if (!jsonData || Object.keys(jsonData).length === 0) return "";

	const transformedData: { [username: string]: VolunteerShiftReport } = {};

	// Process each month's data
	monthRange.forEach((monthName) => {
		const records = jsonData[monthName];
		if (records) {
			records.forEach((record) => {
				if (!transformedData[record.username]) {
					transformedData[record.username] = {
						username: record.username,
						name: record.name,
						total_wtq_time: 0,
						total_ptft_time: 0,
						total_other_time: 0,
						total_time: 0
					};
				}

				// Update transformed data
				const userRecord = transformedData[record.username];
				userRecord[`total_wtq_time_${monthName}`] = record.total_wtq_time;
				userRecord[`total_ptft_time_${monthName}`] = record.total_ptft_time;
				userRecord[`total_other_time_${monthName}`] = record.total_other_time;
				userRecord.is_youth = record.is_youth;
				userRecord.date_registered = record.date_registered;
			});
		}
	});

	const result: VolunteerShiftReport[] = Object.values(transformedData);

	// Generate dynamic headers
	const headers = [
		"Name",
		"Date Registered",
		"Youth",
		"Totals",
		"OCB & WTQ",
		"PFTP",
		...monthRange.flatMap((monthName) => [
			`${monthName}`,
			`PFTP ${monthName}`,
			`WTQ ${monthName}`
		])
	];

	let totalHour = 0;

	const data = await Promise.all(
		monthRange.map(async (monthName) => {
			const month = monthMap[monthName];
			if (!month) throw new Error(`Unsupported month: ${monthName}`);

			const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
			const endDate = `${year}-${String(month).padStart(2, "0")}-${getDaysInMonth(month, year)}`;

			const { data: monthData, error: fetchError } = await supabase.rpc(
				"get_volunteer_hour_log_total",
				{ start_date: startDate, end_date: endDate }
			);

			if (fetchError) {
				let errorMessage: string;

				if (fetchError instanceof Error) {
					errorMessage = fetchError.message;
				} else if (typeof fetchError === "string") {
					errorMessage = fetchError;
				} else {
					errorMessage = "Unknown error";
				}

				throw new Error(errorMessage);
			}

			const reshapedData = monthData.reduce((acc: any, entry: any) => {
				acc[`total_pftp_${monthName}`] = entry.total_pftp_time_all_users;
				acc[`total_wtq_${monthName}`] = entry.total_wtq_time_all_users;
				acc[`total_other_shift_${monthName}`] =
					entry.total_other_shift_time_all_users;
				acc[`unique_youth_pftp_${monthName}`] = entry.unique_youth_pftp;
				acc[`unique_youth_wtq_${monthName}`] = entry.unique_youth_wtq;
				acc[`unique_youth_other_shift_${monthName}`] =
					entry.unique_youth_other_shift_time;
				acc[`youth_hour_pftp_${monthName}`] = entry.youth_hour_pftp;
				acc[`youth_hour_wtq_${monthName}`] = entry.youth_hour_wtq;
				acc[`youth_hour_other_shift_${monthName}`] =
					entry.youth_hour_other_shift_time;
				return acc;
			}, {});

			// Update total hours
			totalHour +=
				parseFloat(reshapedData[`total_pftp_${monthName}`].toFixed(2)) || 0;
			totalHour +=
				parseFloat(reshapedData[`total_wtq_${monthName}`].toFixed(2)) || 0;
			totalHour +=
				parseFloat(reshapedData[`total_other_shift_${monthName}`].toFixed(2)) ||
				0;

			return reshapedData;
		})
	).then((results) => results.reduce((acc, item) => ({ ...acc, ...item }), {}));

	// Round numbers
	const average = parseFloat((totalHour / 9).toFixed(2));
	totalHour = parseFloat(totalHour.toFixed(2));

	const spacer = ",".repeat(monthRange.length * 3);

	// Generate CSV rows for summary data
	const summaryRows = [
		`Total Hours,,,${totalHour},,,${monthRange
			.map((monthName) =>
				[
					`total_other_shift_${monthName}`,
					`total_pftp_${monthName}`,
					`total_wtq_${monthName}`
				]
					.map((key) => (data[key] !== 0 ? data[key] : ""))
					.join(",")
			)
			.join(",")}\r\n`,
		`Unique Youth,,,,,,${monthRange
			.map((monthName) =>
				[
					`unique_youth_other_shift_${monthName}`,
					`unique_youth_pftp_${monthName}`,
					`unique_youth_wtq_${monthName}`
				]
					.map((key) => (data[key] !== 0 ? data[key] : ""))
					.join(",")
			)
			.join(",")}\r\n`,
		`Youth Hours,,,,,,${monthRange
			.map((monthName) =>
				[
					`youth_hour_other_shift_${monthName}`,
					`youth_hour_pftp_${monthName}`,
					`youth_hour_wtq_${monthName}`
				]
					.map((key) => (data[key] !== 0 ? data[key] : ""))
					.join(",")
			)
			.join(",")}\r\n`,
		`Average,,,${average},,${spacer}\r\n`
	];

	// Generate CSV content for individual users
	const rows = result
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((row) => {
			const totalHours = monthRange.reduce(
				(total, monthName) =>
					total +
					(row[`total_other_time_${monthName}`] || 0) +
					(row[`total_ptft_time_${monthName}`] || 0) +
					(row[`total_wtq_time_${monthName}`] || 0),
				0
			);

			const totalHoursPtft = monthRange.reduce(
				(total, monthName) =>
					total + (row[`total_ptft_time_${monthName}`] || 0),
				0
			);

			const rowData = [
				row.name || "",
				row.date_registered || "",
				row.is_youth || "",
				parseFloat(totalHours.toFixed(2)) || "",
				parseFloat((totalHours - totalHoursPtft).toFixed(2)) || "",
				parseFloat(totalHoursPtft.toFixed(2)) || "",
				...monthRange
					.map((monthName) => [
						row[`total_other_time_${monthName}`] || "",
						row[`total_ptft_time_${monthName}`] || "",
						row[`total_wtq_time_${monthName}`] || ""
					])
					.flat()
			];

			return `"${rowData
				.map((value) => String(value).replace(/"/g, '""'))
				.join('","')}"`;
		});

	// Combine headers, summary, and rows
	const csvContent = [headers.join(","), ...summaryRows, ...rows].join("\r\n");

	return csvContent;
}

function JSONToCSV(jsonData: Array<string> | null): string {
	if (!jsonData || jsonData.length === 0) return "";

	const headers = Object.keys(jsonData[0])
		.map((header) => {
			// Mapping specific headers to human-readable formats
			switch (header) {
				case "dob":
					return "Date of Birth";
				case "last_seen":
					return "Last seen Date";
				case "username":
					return "User Name";
				case "total_time":
					return "Total Time";
				case "total_duration":
					return "Total Time";
				case "shift_type":
					return "Shift Type";
				case "name":
					return "Name";
				case "volunteer_name":
					return "Name";
				default:
					return header; // Return the original header if no mapping
			}
		})
		.join(",");

	const rows = jsonData.map((obj: any) =>
		Object.values(obj)
			.map((value) => `"${String(value).replace(/"/g, '""')}"`)
			.join(",")
	);

	return `${headers}\r\n${rows.join("\r\n")}`;
}

// Function to fetch the report
// get_volunteer_hour_log  query all the volunteer and return there total wtq, pftp and other shift type within a startDate, endDate
// Function to fetch the report
async function getLogHour(startDate: string, endDate: string) {
	const { data, error } = await supabase.rpc("get_volunteer_hour_log", {
		start_date: startDate,
		end_date: endDate
	});

	const processedData = (data as VolunteerShiftReport[])?.map((item) => ({
		name: item.name,
		username: item.username,
		date_registered: formatDate(
			item.date_registered ? new Date(item.date_registered) : null,
			"Not Available"
		),
		is_youth: item.is_youth,
		total_wtq_time: item.total_wtq_time,
		total_ptft_time: item.total_pftp_time,
		total_other_time: item.total_other_shift_time
	}));

	return {
		data: processedData,
		error
	};
}

async function getPeople() {
	const { data, error } = await supabase.from("users").select("*");

	const processedData = (data as Tables<"users">[])?.map((item) => ({
		name: item.name,
		dob: formatDate(item.dob ? new Date(item.dob) : null, "Not Available"),
		username: item.username,
		total_time: formatDuration(item.total_time),
		last_seen: formatDate(new Date(item.last_seen))
	}));

	return {
		data: processedData,
		error
	};
}

async function getShiftType() {
	const { data, error } = await supabase.rpc("get_total_duration_per_shift");

	const processedData = (
		data as { shift_type: string; total_duration: number }[]
	)?.map((item) => ({
		shift_type: item.shift_type,
		total_duration: formatDuration(item.total_duration)
	}));

	return {
		data: processedData,
		error
	};
}


export async function POST(req: NextRequest) {
	const { selectedExportOption, selectedYear } = await req.json();

	const monthRange = [
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

	// Handle missing required parameters
	if (!selectedExportOption) {
		return NextResponse.json(
			{ message: "Please select an export option." },
			{ status: 400 }
		);
	}

	let data: any;
	let error = null;

	switch (selectedExportOption) {
		case "People":
			({ data, error } = await getPeople());
			break;

		case "Shift Type":
			({ data, error } = await getShiftType());
			break;

		case "Hours":
			if (!selectedYear) {
				return NextResponse.json(
					{ message: "Please select a year for Hours." },
					{ status: 400 }
				);
			}
			data = await Promise.all(
				monthRange.map(async (monthName) => {
					const month = monthMap[monthName];
					if (!month) throw new Error(`Unsupported month: ${monthName}`);

					const startDate = `${selectedYear}-${String(month).padStart(2, "0")}-01`;
					const endDate = `${selectedYear}-${String(month).padStart(2, "0")}-${getDaysInMonth(month, selectedYear)}`;

					const { data: monthData, error: fetchError } = await getLogHour(
						startDate,
						endDate
					);

					if (fetchError) {
						let errorMessage = "Unknown error occurred";

						if (typeof fetchError === "string") {
							errorMessage = fetchError;
						} else if (fetchError instanceof Error) {
							errorMessage = fetchError.message;
						}

						throw new Error(errorMessage);
					}

					return {
						[monthName]: monthData
					};
				})
			).then((results) =>
				results.reduce(
					(acc, item) => ({
						...acc,
						...item
					}),
					{}
				)
			);
			break;

		default:
			return NextResponse.json(
				{ message: "Invalid export option selected." },
				{ status: 400 }
			);
	}

	if (error) throw new Error("An error occurred while fetching data.");

	let csv = "";
	if (selectedExportOption === "Hours") {
		csv = await CavanExcelFormat(data, monthRange, selectedYear);
	} else {
		csv = JSONToCSV(data);
	}

	if (!csv) {
		return NextResponse.json(
			{ message: "No data available for export." },
			{ status: 204 }
		);
	}

	return NextResponse.json(
		{ data: csv, message: "Export successful!" },
		{ status: 200 }
	);
}
