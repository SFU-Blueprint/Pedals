import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { Tables } from "@/lib/supabase.types";

export async function POST(req: NextRequest) {
  const { username, shiftType } = await req.json();

  // Handle missing required parameters
  if (!username || !shiftType) {
    return NextResponse.json(
      {
        message: "Please provide your username and current shift type."
      },
      { status: 400 }
    );
  }

  // Retrieve user details from the database using the provided username
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
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
    .select("*")
    .eq("volunteer_id", user.id)
    .eq("is_active", true);

  // Handle potential errors during the retrieve operation
  if (activeShiftError || !activeShift) {
    return NextResponse.json(
      {
        message: "Error occurred while checking in. Please try again."
      },
      { status: 500 }
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

  const currentTime = new Date();
  const currentUser = user as Tables<"users">;

  // Insert a new shift record to mark the user as checked in
  const { error: checkinError } = await supabase.from("shifts").insert({
    volunteer_id: currentUser.id,
    volunteer_name: currentUser.name,
    is_active: true,
    checked_in_at: currentTime.toISOString(),
    shift_type: shiftType
  });

  // Update the user's last active date
  const { error: lastSeenError } = await supabase
    .from("users")
    .update({
      last_seen: currentTime
    })
    .eq("id", currentUser.id);

  // Handle potential errors during the insert operation
  if (checkinError || lastSeenError) {
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
