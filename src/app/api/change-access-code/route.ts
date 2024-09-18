import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

// const minLength = 8;
// const maxLength = 15;
//
// const hasNumbers = (string: string) => /\d/.test(string);
// const hasLetters = (string: string) => /[a-zA-Z]/.test(string);

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: NextRequest) {
  const { currCode, newCode } = await req.json();

  if (!currCode || !newCode) {
    return NextResponse.json(
      {
        message:
          "Please provide your the current password and the new password."
      },
      { status: 400 }
    );
  }
  // Retrieve the current code and check if correct
  const { data: currentPassword, error: currentPasswordError } = await supabase
    .from("access_codes")
    .select("access_code")
    .eq("active", true)
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

  if (currentPassword?.access_code !== currCode) {
    return NextResponse.json(
      {
        message:
          "The provided current password does not match the record in the database"
      },
      { status: 401 }
    );
  }

  // If two password is the same raise error
  if (currCode === newCode) {
    return NextResponse.json(
      {
        message: "The new password must be different from the old password"
      },
      { status: 402 }
    );
  }

  const { error: oldPasswordError } = await supabase
    .from("access_codes")
    .update({
      active: false
    })
    .eq("access_code", currCode);

  // Handle network error
  if (oldPasswordError?.message === "TypeError: fetch failed") {
    return NextResponse.json(
      {
        message: "Network error. Please check your connection and try again."
      },
      { status: 503 }
    );
  }

  // Insert a new password to the database
  const { error: newPasswordError } = await supabase
    .from("access_codes")
    .insert({
      access_code: newCode,
      active: true
    });

  // Handle potential errors during the insert operation
  if (newPasswordError) {
    return NextResponse.json(
      {
        message: "Error occurred while updating password. Please try again."
      },
      { status: 500 }
    );
  }
  // Confirm successful change in password
  return NextResponse.json(
    {
      message: "Change poassword succesfully"
    },
    { status: 200 }
  );
}
