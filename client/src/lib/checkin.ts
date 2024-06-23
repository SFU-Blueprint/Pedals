// src/api/checkin.ts
import supabase from "@/lib/supabase";

/**
 * Check-in a volunteer by updating the in_time column with the current time.
 * @param name - The name of the volunteer checking in.
 * @returns A promise that resolves with the response from Supabase.
 */

export default async function checkin(name: string) {
  await supabase
    .from("volunteers_test")
    .update({ in_time: new Date().toISOString(), out_time: null })
    .eq("name", name);
}
