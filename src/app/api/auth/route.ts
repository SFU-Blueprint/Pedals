import { NextRequest, NextResponse } from "next/server";
import { randomBytes, scryptSync } from "crypto";
import supabase from "@/lib/supabase";

function generateHash(code: string): string {
  const salt = randomBytes(16).toString("hex");
  const hashCode = scryptSync(code, salt, 64).toString("hex");
  return `${salt}:${hashCode}`;
}

function verifyHash(input: string, storedHash: string): boolean {
  const [salt, storedCode] = storedHash.split(":");
  const hashInput = scryptSync(input, salt, 64).toString("hex");
  return hashInput === storedCode;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Missing username or password." },
        { status: 400 }
      );
    }

    // Check for an active code in the database
    const { data, error } = await supabase
      .from("auth_codes")
      .select("username, password")
      .eq("is_active", true)
      .single();

    if (error || !data) {
      console.log("No active code found or database query error:", error);

      // Generate and insert new credentials
      const newUsernameHash = generateHash(username);
      const newPasswordHash = generateHash(password);

      const { error: insertError } = await supabase.from("auth_codes").insert({
        username: newUsernameHash,
        password: newPasswordHash,
        is_active: true,
      });

      if (insertError) {
        console.error("Error inserting new credentials:", insertError);
        return NextResponse.json(
          { message: "Failed to set new credentials." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "No active code found. New credentials set successfully." },
        { status: 201 }
      );
    }

    // Validate the credentials
    if (!verifyHash(username, data.username) || !verifyHash(password, data.password)) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Authentication successful." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected server error:", err);
    return NextResponse.json(
      { message: "Server error." },
      { status: 500 }
    );
  }
}