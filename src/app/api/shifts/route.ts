import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET() {
  // Fetch all shifts from the database
  const { data, error } = await supabase.from("shifts").select("*");

  // Handle potential errors during the fetch operation
  if (error) {
    return NextResponse.json(
      {
        message: "Error occurred while fetching shifts. Please reload the page."
      },
      { status: 500 }
    );
  }

  // Confirm success
  return NextResponse.json(data, { status: 200 });
}
