import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// export default async function POST(req: Request) {
// const body = await req.json();
// const { email, shiftId } = body;
//
// if (!email || !shiftId) {
//   return NextResponse.json(
//	 { error: "Email and Shift ID are required" },
//	 { status: 400 }
//   );
// }
//
// try {
//   const { data: userData, error: userError } = await supabase
//	 .from("users")
//	 .select("sid")
//	 .eq("email", email)
//	 .single();
//
//   if (userError || !userData) {
//	 return NextResponse.json(
//	   { error: userError?.message || "User not found" },
//	   { status: 500 }
//	 );
//   }
//
//   const userId = userData.sid;
//
//   const { data: volunteerData, error: volunteerError } = await supabase
//	 .from("volunteers")
//	 .select("vid")
//	 .eq("user_id", userId)
//	 .single();
//
//   if (volunteerError || !volunteerData) {
//	 return NextResponse.json(
//	   { error: volunteerError?.message || "Volunteer not found" },
//	   { status: 500 }
//	 );
//   }
//
//   const volunteerId = volunteerData.vid;
//
//   const { data, error } = await supabase
//	 .from("volunteer_shifts")
//	 .update({
//	   status: "checked in",
//	   checked_in_at: new Date().toISOString()
//	 })
//	 .eq("volunteer_id", volunteerId)
//	 .eq("shift_id", shiftId);
//
//   if (error) {
//	 return NextResponse.json({ error: error.message }, { status: 500 });
//   }
//
//   return NextResponse.json({
//	 message: "Volunteer checked in successfully",
//	 data
//   });
// } catch (error) {
//   let errorMessage = "An unknown error occurred";
//
//   if (error instanceof Error) {
//	 errorMessage = error.message;
//   }
//
//   return NextResponse.json({ error: errorMessage }, { status: 500 });
// }
// }

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  const body = await req.json();
  const { userName, shiftId } = body;

  if (!userName || !shiftId) {
    return NextResponse.json(
      {
        message: "Please provide a username and a shiftID"
      },
      { status: 400 }
    );
  }

  if (supabaseUrl && key) {
    const supabase = createClient(supabaseUrl, key);
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

  return NextResponse.json({
    message: "Encounter problem when try to send a request"
  });
}
