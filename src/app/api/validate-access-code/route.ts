import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export default async function POST(req: Request) {
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
      .from("access-codes")
      .select("*")
      .eq("id", 1);

    // Assuming accessCodeData is an array of strings and accessCodeToCheck is a string
    if (accessCodeData === null) {
      return NextResponse.json(
        { error: "Empty accessCode table" },
        { status: 500 }
      );
    }

    const hasAccessCode = accessCodeData.some(
      (accessCode) => accessCode === accessCodeToCheck
    );

    if (hasAccessCode) {
      return NextResponse.json(
        {
          message: "Manage page accsessed successfully"
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
