import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

function jsonToCsv(jsonData: any[]) {
  if (!jsonData || jsonData.length === 0) {
    return "";
  }

  // Extract headers (keys) from the first object
  const headers = Object.keys(jsonData[0]);

  // Map through the data to create CSV rows
  const rows = jsonData.map((obj) =>
    headers.map((header) => obj[header]).join(",")
  );

  // Combine headers and rows
  return [headers.join(","), ...rows].join("\n");
}

export async function GET() {
  const { data, error } = await supabase.rpc("get_volunteer_hours");

  // Handle network error
  if (error?.message === "TypeError: fetch failed") {
    return NextResponse.json(
      {
        message: "Network error. Please check your connection and try again."
      },
      { status: 503 }
    );
  }

  // Convert the data to CSV and return
  const csvContent = jsonToCsv(data);

  return NextResponse.json(
    {
      data: csvContent
    },
    { status: 200 }
  );
}
