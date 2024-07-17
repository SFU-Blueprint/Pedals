import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* eslint-disable-next-line import/prefer-default-export */
export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  const body = await req.json();
  const { accessCodeToCheck } = body;

  if (!accessCodeToCheck) {
    return NextResponse.json(
      { error: "Missing required field" },
      { status: 400 }
    );
  }

  if (supabaseUrl && key) {
    const supabase = createClient(supabaseUrl, key);

    const { data: accessCodeData, error } = await supabase
      .from("access_codes")
      .select("access_code");

    // Assuming accessCodeData is an array of strings and accessCodeToCheck is a string
    if (!accessCodeData) {
      return NextResponse.json(
        { error: "Empty accessCode table" },
        { status: 500 }
      );
    }

    let hasAccessCode = false;

    accessCodeData.forEach((code) => {
      if (code.access_code === accessCodeToCheck) hasAccessCode = true;
    });

    if (hasAccessCode) {
      return NextResponse.json(
        {
          message: "Manage page accessed successfully"
        },
        { status: 200 }
      );
    }

    if (error) {
      return NextResponse.json({ error: (error as unknown as Error).message });
    }

    return NextResponse.json({
      message: "Access code does not exist on the database"
    });
  }
}
