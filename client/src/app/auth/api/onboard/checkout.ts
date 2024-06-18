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

  // Extract user email and shift ID from the request body
  const { email, shiftId } = req.body;

  if (!email || !shiftId) {
    res.status(400).json({ error: "Email and Shift ID are required" });
    return;
  }

  try {
    // Fetch user ID from the users table using the email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("sid")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      res.status(500).json({ error: userError?.message || "User not found" });
      return;
    }

    const userId = userData.sid;

    // Fetch volunteer ID from the volunteers table using the user ID
    const { data: volunteerData, error: volunteerError } = await supabase
      .from("volunteers")
      .select("vid")
      .eq("user_id", userId)
      .single();

    if (volunteerError || !volunteerData) {
      res
        .status(500)
        .json({ error: volunteerError?.message || "Volunteer not found" });
      return;
    }

    const volunteerId = volunteerData.vid;

    // Update the volunteer status and timestamp in the volunteer_shifts table
    const { data, error } = await supabase
      .from("volunteer_shifts")
      .update({
        status: "checked out",
        checked_out_at: new Date().toISOString()
      })
      .eq("volunteer_id", volunteerId)
      .eq("shift_id", shiftId);

    // Error handling
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res
      .status(200)
      .json({ message: "Volunteer checked out successfully", data });
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
