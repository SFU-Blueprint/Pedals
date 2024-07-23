import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// https://maryetokwudo.hashnode.dev/nextjs-13-route-handlers-with-typescript
/* eslint-enable import/prefer-default-export */
export const GET = async () => {
  const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL as string;
  const key = process.env.SUPABASE_KEY as string;

  try {
    const supabase = createClient(supabaseUrl, key);
    const { data, error } = await supabase.from("users").select("name");
    if (error) {
      return NextResponse.json({ message: error });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};

// sid, created_at, name, dob, pronoun, email, phone
