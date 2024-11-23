import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { formatDate, formatDuration } from "@/utils/DateTime";

function JSONToCSV(jsonData: Array<any> | null): string {
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
        default:
          return header; // Return the original header if no mapping
      }
    })
    .join(",");

  const rows = jsonData.map((obj) =>
    Object.values(obj)
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  );

  return `${headers}\r\n${rows.join("\r\n")}`;
}

async function getPeople() {
  const { data, error } = await supabase
    .from("users")
    .select("name, dob, username, total_time, last_seen");

  data?.map((item) => {
    item.total_time = formatDuration(item.total_time);
    item.dob = formatDate(
      item.dob ? new Date(item.dob) : null,
      "Not Available"
    ); // dob can be null
    item.last_seen = formatDate(new Date(item.last_seen));
  });

  return {
    data,
    error
  };
}

async function getHours(input_year: string) {
  let { data, error } = await supabase.rpc("get_total_duration_by_year", {
    input_year
  });

  data?.map((item) => {
    item.total_duration = formatDuration(item.total_duration);
  });

  return {
    data,
    error
  };
}

async function getShiftType() {
  const { data, error } = await supabase.rpc("get_total_duration_per_shift"); // Check supabase for function

  data?.map((item) => {
    item.total_duration = formatDuration(item.total_duration);
  });

  return {
    data,
    error
  };
}

export async function POST(req: NextRequest) {
  const { selectedExportOption, selectedYear } = await req.json();
  // console.log(selectedExportOption);

  // Handle missing required parameters
  if (!selectedExportOption) {
    return NextResponse.json(
      {
        message: "You have not yet selected an export option"
      },
      { status: 400 }
    );
  }
  let data, error;

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
          {
            message: "Client error"
          },
          { status: 401 }
        );
      }
      ({ data, error } = await getHours(selectedYear));
      break;

    default:
      return NextResponse.json(
        {
          message: "Client error"
        },
        { status: 401 }
      );
  }

  // Handle network error
  if (error?.message === "TypeError: fetch failed") {
    return NextResponse.json(
      {
        message: "Network error. Please check your connection and try again."
      },
      { status: 503 }
    );
  }

  const csv = JSONToCSV(data);
  if (!csv) {
    return NextResponse.json(
      {
        message: "Data is not avaialble"
      },
      { status: 402 }
    );
  }

  return NextResponse.json(
    {
      data: csv
    },
    { status: 200 }
  );
}
