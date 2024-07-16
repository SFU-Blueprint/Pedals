// 1. Create the GET /api/shifts and POST /api/shifts endpoints.

import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// https://maryetokwudo.hashnode.dev/nextjs-13-route-handlers-with-typescript
export const GET = async () => {
  const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL as string;
  const key = process.env.SUPABASE_KEY as string;

  try {
    const supabase = createClient(supabaseUrl, key);
    const { data, error } = await supabase.from("shifts").select("id");
    console.log(data);
    if (error) {
      return NextResponse.json({ message: error });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL as string;
  const key = process.env.SUPABASE_KEY as string;

  try {
    const req_body = await request.json();

    if (!req_body) {
      return NextResponse.json({
        message: "Please provided a req_body"
      });
    }

    const supabase = createClient(supabaseUrl, key);
    const { data, error } = await supabase.from("shifts").upsert(req_body);

    if (error || !data) {
      return NextResponse.json({ message: error });
    }

    return NextResponse.json(
      { message: "Shift created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};

// id, created_at, date, time, required_volunteer
