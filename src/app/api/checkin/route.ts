import {  NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest){

  const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  if (supabaseUrl && key){
      const supabase = createClient(supabaseUrl, key);

    const url = new URL(request.url);
    const username = url.searchParams.get('username');

    const {data: volunteer, error : volunteerError} = await supabase
          .from("volunteers")
          .select("*")
          .eq('name', username)
          .single();

      if (volunteerError) {
          return NextResponse.json({
              message: volunteerError
          })
      }

      const {data: checkedInAt, error: VolunteerShiftError} = await supabase
          .from("volunteer_shifts")
          .select("checked_in_at")
          .eq('volunteer_id', volunteer.vid);

      if (VolunteerShiftError) {
          return NextResponse.json({
              message: VolunteerShiftError
          })
      }

      return NextResponse.json(checkedInAt);
  }

  return NextResponse.json({
      message: "Encounter problem when try to send a request"
  })
}
