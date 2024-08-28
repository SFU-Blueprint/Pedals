import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { accessCode } = body;
  if (!accessCode) {
    return NextResponse.json(
      { message: "Missing required field" },
      { status: 400 }
    );
  }

  const { data, error, status, statusText } = await supabase
    .from("access_codes")
    .select("access_code");

  if (error) {
    return NextResponse.json({ message: statusText }, { status });
  }

  // Assuming data is an array of strings and accessCode is a string
  if (!data) {
    return NextResponse.json(
      { message: "Empty access_code table" },
      { status: 500 }
    );
  }

  let hasAccessCode = false;
  data.forEach((code) => {
    if (code.access_code === accessCode) {
      hasAccessCode = true;
    }
  });

  if (hasAccessCode) {
    return NextResponse.json(
      {
        message: "Manage page accessed successfully"
      },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: "Wrong access code" }, { status: 401 });
}
