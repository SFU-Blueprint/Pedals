import { NextResponse, NextRequest } from "next/server";
import supabase from "@/lib/supabase";

export const DELETE = async (req: NextRequest) => {
  const id = new URL(req.url).pathname.split("/").pop();

  // Handle missing required parameters
  if (!id) {
    return NextResponse.json(
      {
        message: "No users selected"
      },
      { status: 400 }
    );
  }

  // Delete the user with the associated ID
  const { error } = await supabase.from("users").delete().eq("id", id);

  // Handle potential errors during the delete operation
  if (error) {
    return NextResponse.json(
      {
        message: "Error occurred while deleting the user. Please try again."
      },
      { status: 500 }
    );
  }

  // Confirm successful user deletion
  return NextResponse.json(
    { message: "User deleted successfully" },
    { status: 200 }
  );
};
