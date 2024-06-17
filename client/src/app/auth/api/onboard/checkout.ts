import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

// access environment variables
// No access to process.env to know identifiers for the environment variables
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "") as string;
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_KEY || "") as string;

// make sure we have the required environment variables
// if (!supabaseUrl) {
//   throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
// }
//
// if (!supabaseKey) {
//   throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_KEY');
// }

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * API route handler to check out a user by updating their status and recording the timestamp.
 *
 * @param {NextApiRequest} req - The incoming request object. Expects a POST request with the user's email in the body.
 * @param {NextApiResponse} res - The outgoing response object. Returns a JSON object with a success or error message.
 *
 * @returns {promise<void>} This function does not return a value directly, but sends a response to the client.
 *
 * @throws {Error} Will throw an error if updating the user's status fails.
 */
export default async function checkout(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Extract user email from the request body
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  try {
    // Update the user status and timestamp
    const { data, error } = await supabase
      .from("users") // select the users table
      .update({
        // update the user's status and timestamp
        status: "checked out",

        // i don't know what the column name is for the timestamp
        checked_out_at: new Date().toISOString() // set the timestamp to the current date and time
      })
      .eq("email", email); // find the user by their email

    // credit to register.ts for the error handling
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: "User checked out successfully", data });
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
