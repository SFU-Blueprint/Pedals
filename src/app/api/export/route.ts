import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function convertToCSV(arr: any[]): string {
  if (arr.length === 0) return "";

  const headers = Object.keys(arr[0]);
  const csvRows = [
    headers.join(","), // CSV header row
    ...arr.map((row) =>
      headers.map((fieldName) => JSON.stringify(row[fieldName] ?? "")).join(",")
    )
  ];

  return csvRows.join("\n");
}
/* eslint-disable-next-line import/prefer-default-export */
export async function GET() {
  const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL as string;
  const key = process.env.SUPABASE_KEY as string;

  try {
    const supabase = createClient(supabaseUrl, key);
    const { data, error } = await supabase.from("access_codes").select("*");

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    // Convert data to CSV
    const csv = convertToCSV(data);

    // // Set headers for CSV download
    const headers = new Headers();
    headers.append("Content-Type", "text/csv");
    headers.append(
      "Content-Disposition",
      "attachment; filename=volunteers.csv"
    );

    // Return the CSV data
    return new NextResponse(csv, {
      /* eslint-disable-next-line object-shorthand */
      status: 200,
      /* eslint-disable-next-line object-shorthand */
      headers: headers
    });

    // return NextResponse.json({ message: "Success"}, { status: 200});
  } catch (error) {
    // console.error("Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
