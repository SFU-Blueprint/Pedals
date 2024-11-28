import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { randomBytes, scrypt, scryptSync } from "crypto";



// Return the salt and hash code in form ${salt}:${hashCode}
function hash(code: string) : string {
  const salt = randomBytes(16).toString("hex");
  const hashCode = scryptSync(code, salt, 64).toString("hex");
  return `${salt}:${hashCode}`;
}

// verify the input value is equal to the access code
function verify(input: string, hashCode: string) : boolean {
  const[salt, accessCode] = hashCode.split(":");
  const hashInput = scryptSync(input, salt, 64).toString("hex");
  return hashInput == accessCode;
}

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
    if (!data || !verify(code, data.code)) {
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
    if (!currentCode || !verify(oldCode, currentCode.code)) {
      return NextResponse.json({ message: "The current access code does not match. Please try again." }, { status: 409 });
    }

    // Prevent using the same code for old and new codes
    if (oldCode === newCode) {
      return NextResponse.json({ message: "The new access code is the same as the current active code." }, { status: 409 });
    }

    // Hash the new access code
    const newCodeHash = hash(newCode);

    // Delete all previous access codes from the database (ensures only one active code)
    const { error: deleteError } = await supabase
      .from("access_codes")
      .delete()
      .neq("code", newCode); // Delete all codes except the new one

    if (deleteError) {
      return NextResponse.json({ message: "Error occurred while deleting old access codes. Please try again." }, { status: 500 });
    }

    // Insert the new access code and mark it as active
    const { error: insertError } = await supabase
      .from("access_codes")
      .insert({ code: newCodeHash, is_active: true });

    if (insertError) {
      return NextResponse.json({ message: "Error occurred while inserting the new access code. Please try again." }, { status: 500 });
    }

    // Success response for access code update
    return NextResponse.json({ message: "Access code updated successfully." }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Unexpected server error. Please try again later." }, { status: 500 });
  }
}

