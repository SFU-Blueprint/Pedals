import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { formatDate, formatDuration } from "@/utils/DateTime";
import { Tables } from "@/lib/supabase.types";

function JSONToCSV(jsonData: Array<any> | undefined): string {
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

export async function POST(req: NextRequest) {
  const { selectedExportOption } = await req.json();

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
      break;
    case "Hours":
      break;
    default:
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

  return NextResponse.json(
    {
      data: csv,
      message: "Export successful!"
    },
    { status: 200 }
  );
}
