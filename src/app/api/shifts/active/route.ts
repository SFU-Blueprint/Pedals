import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export const dynamic = "force-dynamic";

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
      { status: 500 }
    );
  }

  // Confirm success
  return NextResponse.json(
    { data, message: "Active shifts loaded." },
    { status: 200 }
  );
}
