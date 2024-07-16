import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// DELERE /api/people/:id
export const DELETE = async (request: NextRequest) => {
  const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL as string;
  const key = process.env.SUPABASE_KEY as string;

  try {
    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop();
    console.log(id);

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
