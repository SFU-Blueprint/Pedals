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

function CavanExcelFormat(
  jsonData: { [key: string]: Array<VolunteerShiftReport> | null },
  monthRange: string[]
): string {
  if (!jsonData || Object.keys(jsonData).length === 0) return "";

  const transformedData: { [username: string]: VolunteerShiftReport } = {};

  for (const monthName of monthRange) {
    const records = jsonData[monthName];
    if (records) {
      for (const record of records) {
        if (!transformedData[record.username]) {
          transformedData[record.username] = {
            username: record.username,
            name: record.name,
            total_wtq_time: 0,
            total_ptft_time: 0,
            total_other_time: 0
          };
        }

        // Update properties with the respective month's values
        transformedData[record.username][`total_wtq_time_${monthName}`] =
          record.total_wtq_time;
        transformedData[record.username][`total_ptft_time_${monthName}`] =
          record.total_ptft_time;
        transformedData[record.username][`total_other_time_${monthName}`] =
          record.total_other_time;
      }
    }
  }

  const result: VolunteerShiftReport[] = Object.values(transformedData);

  // Generate headers dynamically with the new names
  const headers = [
    "Name",
    "Date Registered",
    "Youth",
    "Totals",
    "OCB & WTQ",
    "PFTP"
  ];

  for (const monthName of monthRange) {
    // Maintain the right order when push to csvContent
    headers.push(`${monthName}`);
    headers.push(`PFTP ${monthName}`);
    headers.push(`WTQ ${monthName}`);
  }

  // Start building the CSV string with the headers
  let csvContent = headers.join(",") + "\r\n";
  const dynamicColumns = monthRange.length * 3;
  const spacer = ",".repeat(dynamicColumns);

  csvContent += `Total Hours,,,,,${spacer}\r\n`;
  csvContent += `Unique Youth,,,,,${spacer}\r\n`;
  csvContent += `Youth Hours,,,,,${spacer}\r\n`;
  csvContent += `Average,,,,,${spacer}\r\n`;

  const sortedData = result.sort(
    (a: VolunteerShiftReport, b: VolunteerShiftReport) =>
      a.name.localeCompare(b.name)
  );

  // Variable to keep track of the last first letter
  let lastFirstLetter = "";

  // Add the rows based on the sorted JSON data
  sortedData.forEach((row: VolunteerShiftReport) => {
    const currentFirstLetter = row.name.charAt(0).toUpperCase(); // Get the first letter of the name

    // Insert the "blocker" row if the first letter changes
    if (currentFirstLetter !== lastFirstLetter) {
      // Add blocker row with the first letter
      csvContent += `"${currentFirstLetter}",,,,,,,\r\n`;
      lastFirstLetter = currentFirstLetter; // Update last first letter
    }

    // Add the actual data row
    const rowData = [
      row.name || "",
      row.dateRegistered || "",
      row.youth || "",
      row.totals || "",
      row.ocbWfq || "",
      row.pftp || "",
      ...monthRange
        .map((monthName) => [
          row[`total_other_time_${monthName}`] || "",
          row[`total_ptft_time_${monthName}`] || "",
          row[`total_wtq_time_${monthName}`] || ""
        ])
        .flat()
    ];

    csvContent +=
      rowData
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",") + "\r\n";
  });

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
    total_wtq_time: (item.total_wtq_time / 3600).toFixed(2),
    total_ptft_time: (item.total_pftp_time / 3600).toFixed(2),
    total_time: (
      (item.total_wtq_time +
        item.total_pftp_time +
        item.total_other_shift_time) /
      3600
    ).toFixed(2),
    total_other_time: (item.total_other_shift_time / 3600).toFixed(2)
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

async function getHours(input_year: string) {
  const { data, error } = await supabase.rpc("get_total_duration_by_year", {
    input_year
  });

  const processedData = (
    data as { volunteer_name: string; total_duration: number }[]
  )?.map((item) => ({
    volunteer_name: item.volunteer_name,
    total_duration: formatDuration(item.total_duration)
  }));

  return {
    data: processedData,
    error
  };
}

const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

export async function POST(req: NextRequest) {
  const { selectedExportOption, selectedYear } = await req.json();
  const monthRange = ["November", "December"];

  // Handle missing required parameters
  if (!selectedExportOption) {
    return NextResponse.json(
      { message: "Please select an export option." },
      { status: 400 }
    );
  }

  let data: any;
  let error = null;

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

  switch (selectedExportOption) {
    case "People":
      ({ data, error } = await getPeople());
      break;

    case "Shift Type":
      ({ data, error } = await getShiftType());
      break;

    case "Hours Log":
      const year = 2024;
      data = {};
      for (const monthName of monthRange) {
        const month = monthMap[monthName];
        if (!month) throw new Error(`Unsupported month: ${monthName}`);

        const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
        const endDate = `${year}-${String(month).padStart(2, "0")}-${getDaysInMonth(month, year)}`;

        const { data: monthData, error: fetchError } = await getLogHour(
          startDate,
          endDate
        );
        if (fetchError) {
          console.error(`Error fetching data for ${monthName}:`, fetchError);
          error = fetchError;
          continue; // Log the error but continue fetching other months
        }

        if (monthData) {
          data[monthName] = monthData;
        }
      }
      break;

    case "Hours":
      if (!selectedYear) {
        return NextResponse.json(
          { message: "Please select a year for Hours." },
          { status: 400 }
        );
      }
      ({ data, error } = await getHours(selectedYear));
      break;

    default:
      return NextResponse.json(
        { message: "Invalid export option selected." },
        { status: 400 }
      );
  }

  if (error) throw new Error("An error occurred while fetching data.");

  let csv = "";
  if (selectedExportOption === "Hours Log") {
    csv = CavanExcelFormat(data, monthRange);
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
