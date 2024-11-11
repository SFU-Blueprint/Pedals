import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

/**
 * Handles access code validation and updates
 * POST: Validates the provided access code
 * PATCH: Updates the access code if old code matches the current active code
 */

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    // Check for missing access code parameter
    if (!code) {
      return NextResponse.json({ message: "Please provide the access code." }, { status: 400 });
    }

    // Retrieve the active access code from the database
    const { data, error } = await supabase
      .from("access_codes")
      .select("code, is_active")
      .eq("code", code)
      .eq("is_active", true)
      .single();

    // Handle network or database errors
    if (error) {
      if (error.message === "TypeError: fetch failed") {
        return NextResponse.json({ message: "Network error. Please check your connection and try again." }, { status: 503 });
      }
      return NextResponse.json({ message: "Database error occurred. Please try again later." }, { status: 500 });
    }

    // Handle invalid or inactive access code
    if (!data) {
      return NextResponse.json({ message: "Invalid or inactive access code. Please try again." }, { status: 401 });
    }

    // Success response for valid access code
    return NextResponse.json({ message: "Access code validation successful." }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Unexpected server error. Please try again later." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { oldCode, newCode } = await req.json();

    // Check for missing parameters
    if (!oldCode || !newCode) {
      return NextResponse.json({ message: "Please provide both the current and new access codes." }, { status: 400 });
    }

    // Retrieve the current active access code
    const { data: currentCode, error: currentCodeError } = await supabase
      .from("access_codes")
      .select("code")
      .eq("is_active", true)
      .single();

    // Handle network or database errors
    if (currentCodeError) {
      if (currentCodeError.message === "TypeError: fetch failed") {
        return NextResponse.json({ message: "Network error. Please check your connection and try again." }, { status: 503 });
      }
      return NextResponse.json({ message: "Database error occurred while retrieving current access code." }, { status: 500 });
    }

    // Handle mismatch of provided old code and current active code
    if (currentCode?.code !== oldCode) {
      return NextResponse.json({ message: "The current access code does not match. Please try again." }, { status: 409 });
    }

    // Prevent using the same code for old and new codes
    if (oldCode === newCode) {
      return NextResponse.json({ message: "The new access code is the same as the current active code." }, { status: 409 });
    }

    // Check if the new code was a past code and reactivate if it exists
    const { data: pastCode, error: pastCodeError } = await supabase
      .from("access_codes")
      .select("code")
      .eq("code", newCode)
      .eq("is_active", false)
      .single();

    if (pastCodeError) {
      return NextResponse.json({ message: "Database error occurred while checking past codes. Please try again." }, { status: 500 });
    }

    if (pastCode) {
      // Reactivate the past code and deactivate the current one
      const { error: reactivateError } = await supabase
        .from("access_codes")
        .update({ is_active: true })
        .eq("code", newCode);

      if (reactivateError) {
        return NextResponse.json({ message: "Error occurred while reactivating the past code. Please try again." }, { status: 500 });
      }

      const { error: deactivateError } = await supabase
        .from("access_codes")
        .update({ is_active: false })
        .eq("code", oldCode);

      if (deactivateError) {
        return NextResponse.json({ message: "Error occurred while deactivating the old access code. Please try again." }, { status: 500 });
      }

      return NextResponse.json({ message: "Access code reactivated successfully." }, { status: 200 });
    }

    // If not a past code, deactivate old code and insert new one
    const { error: deactivateError } = await supabase
      .from("access_codes")
      .update({ is_active: false })
      .eq("code", oldCode);

    if (deactivateError) {
      return NextResponse.json({ message: "Error occurred while deactivating the old access code. Please try again." }, { status: 500 });
    }

    const { error: insertError } = await supabase
      .from("access_codes")
      .insert({ code: newCode, is_active: true });

    if (insertError) {
      return NextResponse.json({ message: "Error occurred while inserting the new access code. Please try again." }, { status: 500 });
    }

    // Success response for access code update
    return NextResponse.json({ message: "Access code updated successfully." }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Unexpected server error. Please try again later." }, { status: 500 });
  }
}
