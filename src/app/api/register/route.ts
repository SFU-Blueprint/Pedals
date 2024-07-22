import { NextResponse } from "next/server";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import error from "next/error";

// Environment variables for Supabase
const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

// Initialize Supabase client
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Function to get user by username
async function getUserByUsername(username: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error && error.code !== "PGRST116") {
    // Ignore "no rows" error
    console.error("Error fetching user:", error);
  }

  return data;
}

// Function to get volunteere
async function getVolunteerByUsername(user_id: string) {
  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error && error.code !== "PGRST116") {
    // Ignore "no rows" error
    console.error("Error fetching user:", error);
  }

  return data;
}

// Function to create a new user
async function createUser(
  userName: string,
  fullName: string,
  dob: Date,
  timestamp: Date
) {
  const createdAt = new Date(timestamp);
  const { data, error } = await supabase
    .from("users")
    .insert([
      { username: userName, name: fullName, dob: dob, created_at: createdAt }
    ])
    .single();

  if (error) {
    return NextResponse.json({
      message: error
    });
  }

  return NextResponse.json({
    data: data,
    message: "Create successful"
  });
}

// Function to create a volunteer
async function createVolunteer(userId: string, name: string, timestamp: Date) {
  const createdAt = new Date(timestamp);
  const { data, error } = await supabase
    .from("volunteers")
    .insert([{ user_id: userId, name: name, created_at: createdAt }])
    .single();

  if (error) {
    console.log(error);
  }

  return data;
}

// Function to check in volunteer
async function checkInVolunteer(volunteer: any, shiftId: Date) {
  const { data: shift, error: errorShift } = await supabase
    .from("volunteer_shifts")
    .insert({
      volunteer_id: volunteer.vid,
      shift_id: shiftId,
      status: "Available",
      checked_in_at: new Date().toISOString()
    });

  if (errorShift || !shift) {
    return NextResponse.json({
      message: errorShift
    });
  }

  return NextResponse.json({
    message: "Checkin successfully"
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userName, shiftId, fullName, dob } = body;

    const currentDate = new Date();
    const timestamp = currentDate;

    console.log("kek");

    if (!userName || !shiftId || !fullName || !dob) {
      return NextResponse.json(
        {
          message: "Please provide valid details"
        },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await getUserByUsername(userName);
    // If user does not exist, create the user
    if (!user) {
      await createUser(userName, fullName, dob, timestamp);
      user = await getUserByUsername(userName);
      await createVolunteer(user.sid, user.name, timestamp);
      const volunteer = await getVolunteerByUsername(user.sid);
      checkInVolunteer(volunteer, shiftId);
    } else {
      const volunteer = await getVolunteerByUsername(user.sid);
      checkInVolunteer(volunteer, shiftId);
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
