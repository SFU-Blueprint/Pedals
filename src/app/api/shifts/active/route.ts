import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET() {
  // Fetch active shifts from the database
  const { data, error } = await supabase
    .from("shifts")
    .select("*")
    .eq("is_active", true);

  // Handle potential errors during the fetch operation
  if (error) {
    return NextResponse.json(
      {
        message:
          "Error occurred while fetching active shifts. Please reload the page."
      },
      { status: 500 } // 500 Internal Server Error for unexpected issues
    );
  }
  return NextResponse.json(data, { status: 200 });
}
