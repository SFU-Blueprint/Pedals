import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export default async function POST(req: Request) {
  const body = await req.json();
  const accessCodeToCheck = body;
  if (!accessCodeToCheck) {
    return NextResponse.json(
      { error: "Missing required field" },
      { status: 400 }
    );
  }

  try {
    const { data: accessCodeData, error } = await supabase
      .from("access-codes")
      .select("access-code");
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
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
