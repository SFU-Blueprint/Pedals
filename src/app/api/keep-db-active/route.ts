// src/app/api/keep-db-active/route.ts
/* eslint-disable import/prefer-default-export */
import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase.from("keep_db_active").select("*");

  if (error) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
