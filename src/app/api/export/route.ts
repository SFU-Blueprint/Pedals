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
  //get_volunteer_hour is a SQL function create in SQL Editor in supabase. To update this function, go to the SQL editor and drop this function first: DROP FUNCTION get_volunteer_hours(). Create another SQL function like you would with SQL
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
