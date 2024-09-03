import { NextResponse, NextRequest } from "next/server";
import supabase from "@/lib/supabase";

// DELERE /api/people/:id
/* eslint-enable import/prefer-default-export */
export const DELETE = async (request: NextRequest) => {
  try {
    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({
        message: "Please provide an id"
      });
    }
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
