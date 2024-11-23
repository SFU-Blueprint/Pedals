import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { formatDate, formatDuration } from "@/utils/DateTime";
import { Tables } from "@/lib/supabase.types";

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
        case "volunteer_name":
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

export async function POST(req: NextRequest) {
  const { selectedExportOption, selectedYear } = await req.json();
  // Handle missing required parameters
  if (!selectedExportOption) {
    return NextResponse.json(
      {
        message: "Please select an export option."
      },
      { status: 400 }
    );
  }
  let data;
  let error;
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
      data: csv,
      message: "Export successful!"
    },
    { status: 200 }
  );
}
