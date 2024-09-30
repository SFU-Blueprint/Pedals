import { NextResponse, NextRequest } from "next/server";
import supabase from "@/lib/supabase";
import { Tables } from "@/lib/supabase.types";
import { isSameDate } from "@/utils";

export async function POST(req: NextRequest) {
  const { shiftId, volunteerId } = await req.json();

  // Handle missing required parameters
  if (!shiftId || !volunteerId) {
    return NextResponse.json(
      { message: "Missing Shift ID and Volunteer ID" },
      { status: 400 }
    );
  }

  // Retrieve user details from the database using the provided volunteer ID
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", volunteerId)
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
        message:
          "User ID not found. Please contact your manager for assistance."
      },
      { status: 500 }
    );
  }

  // Retrieve the shift details from the database using the provided Shift ID
  const { data: shift, error: shiftError } = await supabase
    .from("shifts")
    .select("*")
    .eq("id", shiftId)
    .single();

  // Handle network error
  if (shiftError?.message === "TypeError: fetch failed") {
    return NextResponse.json(
      {
        message: "Network error. Please check your connection and try again."
      },
      { status: 503 }
    );
  }

  // Handle the case where the shift is not found in the database
  if (shiftError || !shift) {
    return NextResponse.json(
      {
        message:
          "Shift ID not found. Please contact your manager for assistance."
      },
      { status: 500 }
    );
  }

  const currentTime = new Date();
  const currentUser = user as Tables<"users">;
  const currentShift = shift as Tables<"shifts">;

  // Handle discrepancies between user details and shift information
  if (
    currentUser.id !== currentShift.volunteer_id ||
    currentUser.name !== currentShift.volunteer_name ||
    !currentUser.is_volunteer ||
    !currentShift.is_active ||
    !currentShift.shift_type ||
    !currentShift.checked_in_at ||
    currentShift.checked_out_at ||
    currentShift.duration
  ) {
    return NextResponse.json(
      {
        message:
          "Database showing conflicting shift and user details. Please contact your manager for assistance."
      },
      { status: 500 }
    );
  }

  // Handle discrepancies between check-in date and check-out date
  const checkInTime = new Date(currentShift.checked_in_at);
  const checkOutTime = isSameDate(currentTime, checkInTime)
    ? currentTime
    : null;
  const duration =
    checkOutTime &&
    Math.floor((currentTime.getTime() - checkOutTime.getTime()) / 1000);

  // Update the current shift to check out
  const { error: shiftUpdateError } = await supabase
    .from("shifts")
    .update({
      checked_out_at: checkOutTime,
      is_active: false,
      duration: duration
    })
    .eq("id", currentShift.id);

  // Handle potential errors during the shift update operation
  if (shiftUpdateError) {
    return NextResponse.json(
      {
        message: "Error occurred while checking out. Please try again."
      },
      { status: 500 }
    );
  }

  // Update the current user if no date discrepancy was found
  if (duration !== null && checkOutTime) {
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        total_time: currentUser.total_time + duration
      })
      .eq("id", currentUser.id);

    // Handle potential errors during the user update operation
    if (userUpdateError) {
      return NextResponse.json(
        {
          message: "Error occurred while checking out. Please try again."
        },
        { status: 500 }
      );
    }
    // Confirm successful check-out
    return NextResponse.json(
      {
        message: "Check-out successful."
      },
      { status: 200 }
    );
  }

  // Confirm successful shift update with date discrepancy.
  return NextResponse.json(
    {
      message:
        "Shift updated successfully, but there were issues in the check-out date."
    },
    { status: 201 }
  );
}
