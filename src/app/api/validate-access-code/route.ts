import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
  const { accessCode } = await req.json();

  // Handle missing required parameters
  if (!accessCode) {
    return NextResponse.json(
      { message: "Please provide the access code" },
      { status: 400 }
    );
  }

  // Retrieve access codes from the database
  const { data, error } = await supabase
    .from("access_codes")
    .select("access_code");

  // Handle network error
  if (error?.message === "TypeError: fetch failed") {
    return NextResponse.json(
      {
        message: "Network error. Please check your connection and try again."
      },
      { status: 503 }
    );
  }

  // Handle the case where the access_code table is empty
  if (!data) {
    return NextResponse.json(
      { message: "Empty access code table. Please contact the manager." },
      { status: 500 }
    );
  }

  // Check if the provided access code exists in the database
  const hasAccessCode = data.some((code) => code.access_code === accessCode);

  // Handle the case where the access code is incorrect
  if (!hasAccessCode) {
    return NextResponse.json(
      { message: "Incorrect access code. Please try again." },
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
