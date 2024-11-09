import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

function JSONToCSV(
  jsonData: Array<{ name: string; total_time: number }> | null
): string {
  if (!jsonData || jsonData.length === 0) return "";

  const headers = Object.keys(jsonData[0]).join(",");
  const rows = jsonData.map((obj) =>
    Object.values(obj)
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  );

  return `${headers}\r\n${rows.join("\r\n")}`;
}

export async function GET() {
  const { data, error } = await supabase
    .from("users")
    .select("name, total_time");

  // Handle network error
  if (error?.message === "TypeError: fetch failed") {
    return NextResponse.json(
      {
        message: "Network error. Please check your connection and try again."
      },
      { status: 503 }
    );
  }

  const csv = JSONToCSV(
    data as
      | {
          name: string;
          total_time: number;
        }[]
      | null
  );

  return NextResponse.json(
    {
      data: csv
    },
    { status: 200 }
  );
}
