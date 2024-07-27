import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { accessCodeToCheck } = body;
  if (!accessCodeToCheck) {
    return NextResponse.json(
      { error: "Missing required field" },
      { status: 400 }
    );
  }

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

  return NextResponse.json({ error: "Wrong access code" }, { status: 401 });
}
