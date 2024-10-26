import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { username, fullName, dob } = await req.json();

  // Handle missing required parameters
  if (!username || !fullName) {
    return NextResponse.json(
      {
        message: "Please provide your username and your full name"
      },
      { status: 400 }
    );
  }

  // Retrieve any users associated with the current username
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("username")
    .eq("username", username);

  // Handle potential errors during the retrieve operation
  if (userError || !user) {
    return NextResponse.json(
      {
        message: "Error occurred while registering. Please try again."
      },
      { status: 500 }
    );
  }

  // Handle the case where the username is already found in the database
  if (user.length !== 0) {
    return NextResponse.json(
      {
        message: "Username already exists. Please try a different username."
      },
      { status: 409 }
    );
  }

  // Insert a new user record to the database
  const { error: registerError } = await supabase.from("users").insert({
    name: fullName,
    dob: dob,
    username: username,
    is_volunteer: true,
    last_seen: new Date()
  });

  // Handle potential errors during the insert operation
  if (registerError) {
    return NextResponse.json(
      {
        message: "Error occurred while registering. Please try again."
      },
      { status: 500 }
    );
  }

  // Confirm successful register
  return NextResponse.json(
    {
      message:
        "Registration successful! You can now check in on the Check In page."
    },
    { status: 200 }
  );
}
