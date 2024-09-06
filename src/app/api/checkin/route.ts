import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { username, shiftType } = await req.json();

  // Handle missing required parameters
  if (!username || !shiftType) {
    return NextResponse.json(
      {
        message: "Please provide your username and your current type of shift."
      },
      { status: 400 }
    );
  }

  // Retrieve user details from the database using the provided username
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, username, name, is_volunteer")
    .eq("username", username)
    .single();

  // Handle network error
  if (userError?.message === "TypeError: fetch failed") {
    return NextResponse.json(
      {
        message: "Network error. Please check your connection and try again."
      },
      { status: 503 }
    );
  }

  // Handle the case where the user is not found in the database
  if (userError || !user) {
    return NextResponse.json(
      {
        message: "Username not found. Please check your input and try again."
      },
      { status: 404 }
    );
  }

  // Handle the case where the user exists but is not registered as a volunteer
  if (!user.is_volunteer) {
    return NextResponse.json(
      {
        message:
          "User is not registered as a volunteer. Please check with your manager."
      },
      { status: 403 }
    );
  }

  // Retrieve any active shifts associated with the current volunteer
  const { data: activeShift, error: activeShiftError } = await supabase
    .from("shifts")
    .select("volunteer_id, is_active")
    .eq("volunteer_id", user.id)
    .eq("is_active", true);

  // Handle network error
  if (activeShiftError || !activeShift) {
    return NextResponse.json(
      {
        message: "Network error. Please check your connection and try again."
      },
      { status: 503 }
    );
  }

  // Handle the case where the volunteer already has an active shift
  if (activeShift.length !== 0) {
    return NextResponse.json(
      {
        message: "This user is already associated with an active shift."
      },
      { status: 409 }
    );
  }

  // Insert a new shift record to mark the user as checked in
  const { error: checkinError } = await supabase.from("shifts").insert({
    volunteer_id: user.id,
    volunteer_name: user.name,
    is_active: true,
    checked_in_at: new Date().toISOString(),
    shift_type: shiftType
  });

  // Handle potential errors during the insert operation
  if (checkinError) {
    return NextResponse.json(
      {
        message: "Error occurred while checking in. Please try again."
      },
      { status: 500 }
    );
  }

  // Confirm successful check-in
  return NextResponse.json(
    {
      message: "Check-in successful."
    },
    { status: 200 }
  );
}
