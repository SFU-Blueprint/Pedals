import { NextResponse, NextRequest } from "next/server";
import supabase from "@/lib/supabase";
import { Tables } from "@/lib/supabase.types";

export const PATCH = async (req: NextRequest) => {
  const id = new URL(req.url).pathname.split("/").pop();
  const { dob, last_seen } = await req.json();

  // Handle missing required parameters
  if (!dob && !last_seen) {
    return NextResponse.json(
      { message: "Missing details to update." },
      { status: 400 }
    );
  }

  // Retrieve the user details from the database using the provided ID
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
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
      { status: 404 }
    );
  }

  const currentUser = user as Tables<"users">;

  // Update the user with new DOB and last seen values
  const { error: userUpdateError } = await supabase
    .from("users")
    .update({
      dob: dob || currentUser.dob,
      last_seen: last_seen || currentUser.last_seen
    })
    .eq("id", id);

  // Handle potential errors during the user update operation
  if (userUpdateError) {
    return NextResponse.json(
      {
        message: "Error occurred while updating the user. Please try again."
      },
      { status: 500 }
    );
  }

  // Confirm successful update
  return NextResponse.json(
    {
      message: "User details updated successfully."
    },
    { status: 200 }
  );
};
