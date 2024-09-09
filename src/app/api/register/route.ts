import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

/* eslint-disable-next-line import/prefer-default-export */
export async function POST(req: NextRequest) {
  const { username, fullName, dob } = await req.json();

  if (!username || !fullName || !dob) {
    return NextResponse.json(
      {
        message:
          "Please provide your username, your full name and your date of birth"
      },
      { status: 400 }
    );
  }

  // Check if a username exists
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("username")
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

  // Handle error on the supabase
  if (
    userError &&
    userError?.message !==
      "JSON object requested, multiple (or no) rows returned"
  ) {
    return NextResponse.json(
      {
        message: `Error while trying to validate username: ${userError}`
      },
      { status: 500 }
    );
  }

  // Handle the case where the username is already found in the database
  if (user) {
    return NextResponse.json(
      {
        message: "Username already exists. Please try different username"
      },
      { status: 401 }
    );
  }

  // Insert a new user record to the database
  const { error: registerError } = await supabase.from("users").insert({
    name: fullName,
    dob: dob,
    username: username,
    is_volunteer: true
  });

  if (registerError) {
    return NextResponse.json(
      {
        message: `Error occurred while register user on database: ${registerError.message}`
      },
      { status: 500 }
    );
  }

  // Confirm successful register
  return NextResponse.json(
    {
      message: "Register successfully"
    },
    { status: 200 }
  );
}
