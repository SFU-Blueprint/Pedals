import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
  const { code } = await req.json();

  // Handle missing required parameters
  if (!code) {
    return NextResponse.json(
      { message: "Please provide the access code" },
      { status: 400 }
    );
  }

  // Retrieve access codes from the database
  const { data, error } = await supabase
    .from("access_codes")
    .select("code, is_active")
    .eq("code", code)
    .eq("is_active", true)
    .single();

  // Handle network error
  if (error?.message === "TypeError: fetch failed") {
    return NextResponse.json(
      {
        message: "Network error. Please check your connection and try again."
      },
      { status: 503 }
    );
  }

  // Handle the case where the access code is incorrect or unavailable
  if (error || !data) {
    return NextResponse.json(
      { message: "Incorrect or unavailable access code. Please try again." },
      { status: 401 }
    );
  }

  // Confirm successful login
  return NextResponse.json(
    {
      message: "Success"
    },
    { status: 200 }
  );
}
