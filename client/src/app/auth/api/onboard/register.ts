// src/app/auth/api/register.ts

import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Extract user details from the request body
  const { name, dateOfBirth, pronoun, email } = req.body;

  if (!name || !dateOfBirth || !pronoun || !email) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    // Insert the new user data into the users table
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, dob: dateOfBirth, pronoun, email }]);

    if (error) {
      throw Error(error.message);
    }

    res.status(201).json({ message: "User registered successfully", data });
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    // Handle known error types
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      errorMessage = (error as { message: string }).message;
    }

    res.status(500).json({ error: errorMessage });
  }
}

export function findDuplicateUserEmail(email: string): boolean {
  if (email) {
    return true;
  }
  return false;
}

interface RegistrationResponse {
  status: string;
  error?: {
    code: number;
    message: string;
  };
  data?: {
    user: {
      id: string;
    };
  };
  message?: string;
}

export async function registration(
  email: string
): Promise<RegistrationResponse> {
  if (findDuplicateUserEmail(email)) {
    return {
      status: "error",
      error: {
        code: 400,
        message: "Duplicate email"
      }
    };
  }

  return {
    status: "success",
    data: {
      user: {
        id: "123"
      }
    },
    message: "Duplicate email"
  };
}
