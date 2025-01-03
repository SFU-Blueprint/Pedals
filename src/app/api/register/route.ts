import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { uname, fname, birthdate } = await req.json();

  // Handle missing required parameters
  if (!uname || !fname) {
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
    .eq("username", uname);

  // Handle potential errors during the retrieve operation
  if (userError || !user) {
    return NextResponse.json(
      {
        message:
          "Error occurred while checking existing users. Please try again."
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

  // Retrieve any users associated with a similar full name and same date of birth
  let query = supabase
    .from("users")
    .select("name, dob")
    .ilike("name", `%${fname}%`);
  if (birthdate) {
    query = query.eq("dob", birthdate);
  }
  const { data: similarUser, error: similarUserError } = await query;

  // Handle potential errors during the retrieve operation
  if (similarUserError) {
    return NextResponse.json(
      {
        message:
          "Error occurred while checking existing users. Please try again."
      },
      { status: 500 }
    );
  }

  // Handle the case where there is a similar user in the database
  if (similarUser.length !== 0) {
    return NextResponse.json(
      {
        message:
          "A user with a similar name and same date of birth already exists."
      },
      { status: 201 }
    );
  }

  // If no matches found, proceed with registration
  return NextResponse.json(
    { message: "No similar users found. You may proceed with registration." },
    { status: 200 }
  );
}

export async function PUT(req: NextRequest) {
  const { uname, fname, birthdate } = await req.json();

  // Insert a new user record to the database
  const { error: registerError } = await supabase.from("users").insert({
    name: fname,
    dob: birthdate,
    username: uname,
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
