import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

// https://maryetokwudo.hashnode.dev/nextjs-13-route-handlers-with-typescript
/* eslint-enable import/prefer-default-export */
export const GET = async () => {
  try {
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
