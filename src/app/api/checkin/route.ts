import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* eslint-disable-next-line import/prefer-default-export */
export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

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

  if (supabaseUrl && key) {
    const supabase = createClient(supabaseUrl, key);

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
        { status: 400 }
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
        { status: 400 }
      );
    }

    const { data: volunteer, error: volunteerError } = await supabase
      .from("volunteers")
      .select("*")
      .eq("user_id", user.sid)
      .single();

    if (volunteerError) {
      return NextResponse.json({
        message: "There no volunteer with provided userName"
      });
    }

    const { data: shift, error: errorShift } = await supabase
      .from("volunteer_shifts")
      .insert({
        volunteer_id: volunteer.vid,
        shift_id: shiftId.id,
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

  return NextResponse.json({
    message: "Encounter problem when try to send a request"
  });
}
