import { NextResponse, NextRequest } from "next/server";
import supabase from "@/lib/supabase";
import { Tables } from "@/lib/supabase.types";

export const PATCH = async (req: NextRequest) => {
  const id = new URL(req.url).pathname.split("/").pop();
  const { inTime, outTime, type } = await req.json();

  // Handle missing required parameters
  if (!inTime || !outTime || !type) {
    return NextResponse.json(
      { message: "Missing shift details" },
      { status: 400 }
    );
  }

  // Validate that check in time is before check out time
  if (new Date(inTime) > new Date(outTime)) {
    return NextResponse.json(
      { message: "Check out time cannot be before check in time." },
      { status: 400 }
    );
  }

  // Retrieve the shift details from the database using the provided Shift ID
  const { data: shift, error: shiftError } = await supabase
    .from("shifts")
    .select("*")
    .eq("id", id)
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
      { status: 404 }
    );
  }

  const currentShift = shift as Tables<"shifts">;

  // Retrieve the user details from the database using the volunteer ID
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", currentShift.volunteer_id)
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
          "Volunteer ID not found. Please contact your manager for assistance."
      },
      { status: 404 }
    );
  }

  const currentUser = user as Tables<"users">;
  const duration = Math.floor(
    (new Date(outTime).getTime() - new Date(inTime).getTime()) / 1000
  );

  // Update the shift with new shift type and times
  const { error: shiftUpdateError } = await supabase
    .from("shifts")
    .update({
      checked_in_at: inTime,
      checked_out_at: outTime,
      shift_type: type,
      duration: duration
    })
    .eq("id", id);

  // Handle potential errors during the shift update operation
  if (shiftUpdateError) {
    return NextResponse.json(
      {
        message: "Error occurred while updating the shift. Please try again."
      },
      { status: 500 }
    );
  }

  // Update the user's total time
  const { error: userUpdateError } = await supabase
    .from("users")
    .update({
      total_time:
        currentUser.total_time - (currentShift.duration || 0) + duration
    })
    .eq("id", currentUser.id);

  // Handle potential errors during the user update operation
  if (userUpdateError) {
    return NextResponse.json(
      {
        message:
          "Error occurred while updating the volunteer time. Please try again."
      },
      { status: 500 }
    );
  }

  // Confirm successful shift update
  return NextResponse.json(
    {
      message: "Shift updated successfully."
    },
    { status: 200 }
  );
};
