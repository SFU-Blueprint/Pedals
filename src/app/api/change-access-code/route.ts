import { NextResponse, NextRequest } from "next/server";
// import { createClient } from "@supabase/supabase-js";

export const POST = async (request: NextRequest) => {
  const { new_code } = await request.json();

  if (!new_code) {
    return NextResponse.json({
      message: "Please provided an access code"
    });
  }
  // To be implement, not sure how we will tackle this

  return NextResponse.json({
    message: "Update access code successfully"
  });
};
