import { NextRequest, NextResponse } from "next/server";
import { randomBytes, scryptSync } from "crypto";
import jwt, { Secret } from "jsonwebtoken";
import { serialize, parse } from "cookie";
import supabase from "@/lib/supabase";

// Helper function to generate hash with salt
function generateHash(code: string): string {
  const salt = randomBytes(16).toString("hex");
  const hashCode = scryptSync(code, salt, 64).toString("hex");
  return `${salt}:${hashCode}`;
}

// Helper function to verify if input matches the stored hash
function verifyHash(input: string, storedHash: string): boolean {
  const [salt, storedCode] = storedHash.split(":");
  const hashInput = scryptSync(input, salt, 64).toString("hex");
  return hashInput === storedCode;
}

// Helper function to handle database errors in a unified manner
function handleDatabaseError(error: any): NextResponse {
  const errorMessage =
    error.message === "TypeError: fetch failed"
      ? "Network error. Please check your connection and try again."
      : "Database error occurred. Please try again later.";
  const statusCode = error.message === "TypeError: fetch failed" ? 503 : 500;
  return NextResponse.json({ message: errorMessage }, { status: statusCode });
}

const JWT_SECRET = process.env.JWT_SECRET as Secret;

/**
 * POST request handler for validating the provided access code
 * Expects JSON body with { "code": string }
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { message: "Please provide the access code." },
        { status: 400 }
      );
    }

    // Retrieve the active access code from the database
    const { data, error } = await supabase
      .from("access_codes")
      .select("code, is_active")
      .eq("is_active", true)
      .single();

    if (error) return handleDatabaseError(error);

    if (!data || !verifyHash(code, data.code)) {
      return NextResponse.json(
        { message: "Invalid or inactive access code. Please try again." },
        { status: 401 }
      );
    }

    const token = jwt.sign({ accessCode: data.code }, JWT_SECRET, {
      expiresIn: "12h"
    });

    const cookieHeader = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12,
      path: "/", // Cookie accessible to the whole site
      sameSite: "strict"
    });

    return NextResponse.json(
      { message: "Access code validation successful." },
      {
        status: 200,
        headers: {
          "Set-Cookie": cookieHeader // Attach the cookie header here
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unexpected server error. Please try again later." },
      { status: 500 }
    );
  }
}

/**
 * PATCH request handler for updating the access code
 * Expects JSON body with { "existingCode": string, "newCode": string }
 */
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const { existingCode, newCode } = await req.json();

    if (!existingCode || !newCode) {
      return NextResponse.json(
        { message: "Please provide both the current and new access codes." },
        { status: 400 }
      );
    }

    // Retrieve the current active access code
    const { data: currentCode, error: currentCodeError } = await supabase
      .from("access_codes")
      .select("code")
      .eq("is_active", true)
      .single();

    if (currentCodeError) return handleDatabaseError(currentCodeError);

    // Verify the provided existing code against the current active code
    if (!currentCode || !verifyHash(existingCode, currentCode.code)) {
      return NextResponse.json(
        {
          message: "The current access code does not match. Please try again."
        },
        { status: 409 }
      );
    }

    // Prevent using the same code for the new code
    if (existingCode === newCode) {
      return NextResponse.json(
        {
          message: "The new access code is the same as the current active code."
        },
        { status: 409 }
      );
    }

    const newCodeHash = generateHash(newCode);

    // Delete all previous access codes to ensure only one active code
    const { error: deleteError } = await supabase
      .from("access_codes")
      .delete()
      .neq("code", newCode);

    if (deleteError) {
      return NextResponse.json(
        {
          message:
            "Error occurred while deleting old access codes. Please try again."
        },
        { status: 500 }
      );
    }

    // Insert the new access code and mark it as active
    const { error: insertError } = await supabase
      .from("access_codes")
      .insert({ code: newCodeHash, is_active: true });

    if (insertError) {
      return NextResponse.json(
        {
          message:
            "Error occurred while inserting the new access code. Please try again."
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Access code updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unexpected server error. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const { token } = cookies;

    if (!token) {
      return NextResponse.json({ message: "No token found." }, { status: 401 });
    }

    jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ message: "Token is valid." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token." },
      { status: 401 }
    );
  }
}
