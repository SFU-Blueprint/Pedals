import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET() {
  // Fetch all users from the database
  const { data, error: fetchError } = await supabase.from("users").select("*");

  // Handle potential errors during the fetch operation
  if (fetchError) {
    return NextResponse.json(
      {
        message: "Error occurred while fetching users. Please reload the page."
      },
      { status: 500 }
    );
  }

  // Confirm success
  return NextResponse.json(
    { data, message: "Volunteers loaded!" },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  // Helper function to remove duplicates

  const { flag, ids } = await req.json();
  if (flag === "delete_users") {
    const errorShifts = await Promise.all(
      ids.map(async (id: string) => {
        const { data: shifts, error: errorShiftError } = await supabase
          .from("shifts")
          .select()
          .eq("volunteer_id", id)
          .is("checked_out_at", null)
          .eq("is_active", false)
          .is("duration", null);
        if (errorShiftError) {
          return NextResponse.json(
            {
              message:
                "Error occurred while retrieving shifts. Please try again."
            },
            { status: 500 }
          );
        }
        return shifts || [];
      })
    );

    const errorShiftVolunteerId = Array.from(
      new Set(errorShifts.flat().map((shift) => shift.volunteer_id))
    );

    let errorShiftVolunteers = await Promise.all(
      errorShiftVolunteerId.map(async (id: string) => {
        const { data: user, error: errorShiftUserError } = await supabase
          .from("users")
          .select()
          .eq("id", id);
        if (errorShiftUserError) {
          return NextResponse.json(
            {
              message:
                "Error occurred while retrieving users with error shifts in deletion. Please try again."
            },
            { status: 500 }
          );
        }
        return user || [];
      })
    );

    errorShiftVolunteers = errorShiftVolunteers.flat();

    const activeShifts = await Promise.all(
      ids.map(async (id: string) => {
        const { data: shifts, error: activeShiftError } = await supabase
          .from("shifts")
          .select()
          .eq("volunteer_id", id)
          .eq("is_active", true)
          .is("checked_out_at", null)
          .is("duration", null);
        if (activeShiftError) {
          return NextResponse.json(
            {
              message:
                "Error occurred while retrieving shifts. Please try again."
            },
            { status: 500 }
          );
        }
        return shifts || [];
      })
    );

    const activeShiftVolunteerId = Array.from(
      new Set(activeShifts.flat().map((shift) => shift.volunteer_id))
    );

    let activeShiftVolunteers = await Promise.all(
      activeShiftVolunteerId.map(async (id: string) => {
        const { data: user, error: activeShiftUserError } = await supabase
          .from("users")
          .select()
          .eq("id", id);
        if (activeShiftUserError) {
          return NextResponse.json(
            {
              message:
                "Error occurred while retrieving users with active shifts in deletion. Please try again."
            },
            { status: 500 }
          );
        }
        return user || [];
      })
    );

    activeShiftVolunteers = activeShiftVolunteers.flat();

    if (
      activeShiftVolunteers.length !== 0 ||
      errorShiftVolunteers.length !== 0
    ) {
      return NextResponse.json(
        {
          data: [activeShiftVolunteers, errorShiftVolunteers],
          message: "User cannot be removed due to shift issues"
        },
        { status: 201 }
      );
    }
    return NextResponse.json({ data: [] }, { status: 200 });
  }
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
  const { error: deleteError } = await supabase
    .from("users")
    .delete()
    .in("id", ids);

  // Handle potential errors during the fetch operation
  if (deleteError) {
    return NextResponse.json(
      {
        message: "Error occurred while deleting users. Please reload the page."
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
