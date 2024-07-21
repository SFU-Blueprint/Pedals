import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

/* eslint-disable-next-line import/prefer-default-export */
export async function POST() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Successfully logged out" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
