import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { oldCode, newCode } = await req.json();

  // Handle missing required parameters
  if (!oldCode || !newCode) {
    return NextResponse.json(
      {
        message:
          "Please provide your the current password and the new password."
      },
      { status: 400 }
    );
  }

  // Retrieve the current password
  const { data: currentPassword, error: currentPasswordError } = await supabase
    .from("access_codes")
    .select("code")
    .eq("is_active", true)
    .single();

  // Handle network error
  if (currentPasswordError?.message === "TypeError: fetch failed") {
    return NextResponse.json(
      {
        message: "Network error. Please check your connection and try again."
      },
      { status: 503 }
    );
  }

  // Handle the case where the provided password does not match the current password
  if (currentPassword?.code !== oldCode) {
    return NextResponse.json(
      {
        message:
          "The provided current password does not match the record in the database."
      },
      { status: 409 }
    );
  }

  // Handle the case where the old and new passwords are the same
  if (oldCode === newCode) {
    return NextResponse.json(
      {
        message: "The new access code must be different from the old one."
      },
      { status: 409 }
    );
  }

  // Update the status of the old password
  const { error: oldPasswordError } = await supabase
    .from("access_codes")
    .update({
      is_active: false
    })
    .eq("code", oldCode);

  // Handle potential errors during the update operation
  if (oldPasswordError) {
    return NextResponse.json(
      {
        message: "Error occurred while updating access code. Please try again."
      },
      { status: 500 }
    );
  }

  // Insert a new password to the database
  const { error: newPasswordError } = await supabase
    .from("access_codes")
    .insert({
      code: newCode,
      is_active: true
    });

  // Handle potential errors during the insert operation
  if (newPasswordError) {
    return NextResponse.json(
      {
        message: "Error occurred while inserting access code. Please try again."
      },
      { status: 500 }
    );
  }

  // Confirm successful password change
  return NextResponse.json(
    {
      message: "Change access code succesfully."
    },
    { status: 200 }
  );
}
