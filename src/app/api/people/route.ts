import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET() {
  // Fetch all users from the database
  const { data, error } = await supabase.from("users").select("*");

  // Handle potential errors during the fetch operation
  if (error) {
    return NextResponse.json(
      {
        message: "Error occurred while fetching users. Please reload the page."
      },
      { status: 500 }
    );
  }

  // Confirm success
  return NextResponse.json(
    { data, message: "Volunteers Loaded!" },
    { status: 200 }
  );
}

export async function DELETE(req: NextRequest) {
  const { ids } = await req.json();

  // Handle missing required parameters
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      {
        message: "No volunteers selected"
      },
      { status: 400 }
    );
  }

  // Delete the users with the associated IDs
  const { error } = await supabase.from("users").delete().in("id", ids);

  // Handle potential errors during the delete operation
  if (error) {
    return NextResponse.json(
      {
        message:
          "Error occurred while deleting the volunteers. Please try again."
      },
      { status: 500 }
    );
  }

  // Confirm successful user deletion
  return NextResponse.json(
    { message: "Volunteers successfully removed from the database." },
    { status: 200 }
  );
}
