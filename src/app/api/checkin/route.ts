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

export async function GET() {
	const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL;
	const key = process.env.SUPABASE_KEY;
	if (supabaseUrl && key){
		const supabase = createClient(supabaseUrl, key);
		const {data, error} = await supabase.from("user_test").select("*");
		return NextResponse.json(data);
	}

	const data = {
		message: "Hello from API"
	}
	return NextResponse.json(data);
}


export async function POST(req: Request) {
	const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL;
	const key = process.env.SUPABASE_KEY;

	const body = await req.json();
	const { email, shiftId } = body;
	
	if (!email || !shiftId) {
		return NextResponse.json({
			message: "Please provide an email and a shiftID"
		})
	}

	if (supabaseUrl && key){
		const supabase = createClient(supabaseUrl, key);
		const {data, error} = await supabase.from("user_test").select("*").eq("email", email);

		if (error) {
			return NextResponse.json({
				message: error
			})
		}
		return NextResponse.json(data);
	}

	return NextResponse.json({
		message: "Encounter problem when try to send a request"
	})

}
