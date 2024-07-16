import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const POST = async (request: NextRequest) => {
  const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL as string;
  const key = process.env.SUPABASE_KEY as string;

  const { new_code } = await request.json();

  if (!new_code) {
    return NextResponse.json({
      message: "Please provided an access code"
    });
  }

  try {
    const supabase = createClient(supabaseUrl, key);
    const { data, error } = await supabase
      .from("access_codes")
      .update({
        created_at: new Date().toISOString(),
        access_code: new_code
      })
      .eq("id", 1);

    if (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Update access code successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
