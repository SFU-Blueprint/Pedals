import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { userName, shiftType } = body;

  if (!userName || !shiftType) {
    return NextResponse.json(
      {
        message: "Please provide a username and a shiftID"
      },
      { status: 400 }
    );
  }

  const { data: shiftId, error: shiftIdError } = await supabase
    .from("shifts")
    .select("id")
    .eq("shift_name", shiftType.toUpperCase())
    .single();

  if (shiftIdError) {
    return NextResponse.json(
      {
        message: shiftIdError
      },
      { status: 401 }
    );
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("username", userName)
    .single();

  if (userError) {
    return NextResponse.json(
      {
        message: userError
      },
      { status: 402 }
    );
  }

  const { data: volunteer, error: volunteerError } = await supabase
    .from("volunteers")
    .select("*")
    .eq("user_id", user.sid)
    .single();

  if (volunteerError) {
    return NextResponse.json(
      {
        message: "There no volunteer with provided userName"
      },
      { status: 403 }
    );
  }

  const { data: shift, error: errorShift } = await supabase
    .from("volunteer_shifts")
    .insert({
      volunteer_id: volunteer.vid,
      shift_id: shiftId.id,
      status: "Available",
      checked_in_at: new Date().toISOString()
    });

  if (errorShift) {
    return NextResponse.json(
      {
        message: errorShift
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: "Checkin successfully"
    },
    { status: 200 }
  );
}

export async function GET(req: Request) {
  const { data: shifts, error: shiftsError } = await supabase
    .from("shifts")
    .select("*");

  if (shiftsError) {
    return NextResponse.json(
      {
        message: shiftsError
      },
      { status: 400 }
    );
  }

  const res = [];
  for (const shift of shifts) {
    const { data: volunteersId, error: volunteersIdError } = await supabase
      .from("volunteer_shifts")
      .select(
        `
volunteer_id,
volunteers(
	name
)
`
      )
      .eq("shift_id", shift.id);
    if (volunteersId) {
      for (const volunteer of volunteersId) {
        res.push({
          id: volunteer.volunteer_id,
          shiftType: shift.shift_name,
          volunteerName: volunteer.volunteers
        });
      }
    }
  }

  return NextResponse.json(
    {
      data: res
    },
    { status: 200 }
  );
}
