// src/app/api/keep-db-active/route.ts
import { NextRequest, NextResponse } from 'next/server';
import supabase from "@/lib/supabase";
export async function GET(req: NextRequest) {
  const { data, error } = await supabase
    .from('keep_db_active')
    .select('*');

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  } else {
    return NextResponse.json(data, { status: 200 });
  }
}

export const config = {
  runtime: 'experimental-edge',
};
