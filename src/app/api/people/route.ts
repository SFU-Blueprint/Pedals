// 2. Create the GET /api/people and DELETE /api/people/:id endpoints.

import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import supabase from "@/lib/supabase";

// https://maryetokwudo.hashnode.dev/nextjs-13-route-handlers-with-typescript
export const GET = async () => {
  const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL as string;
  const key = process.env.SUPABASE_KEY as string;

  try {
    const supabase = createClient(supabaseUrl, key);
    const { data, error } = await supabase.from("users").select("name");
    console.log(data);
    if (error) {
      return NextResponse.json({ message: error });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};

// not sure how to do query parameters here...
export const DELETE = async (request: NextRequest) => {
  const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL as string;
  const key = process.env.SUPABASE_KEY as string;

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({
        message: "Please provide an id"
      });
    }
    const supabase = createClient(supabaseUrl, key);
    const { error } = await supabase.from("users").delete().eq("sid", id);

    if (error) {
      return NextResponse.json({ message: error });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};

// sid, created_at, name, dob, pronoun, email, phone
