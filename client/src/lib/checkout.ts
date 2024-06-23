// src/api/checkout.ts
import supabase from "@/lib/supabase";

export default async function checkout(name: string) {
  // Fetch the current record for the volunteer to get the previous check-in time
  const { data } = await supabase
    .from("volunteers_test")
    .select("in_time, hours")
    .eq("name", name)
    .single();

  if (data) {
    const previousCheckInTime = new Date(data.in_time);
    const currentTime = new Date();
    const hoursWorked =
      (currentTime.getTime() - previousCheckInTime.getTime()) /
      (1000 * 60 * 60); // Convert milliseconds to hours

    // Update the record with the current time and calculated hours
    await supabase
      .from("volunteers_test")
      .update({
        in_time: null,
        out_time: currentTime.toISOString(),
        hours: data.hours + hoursWorked
      })
      .eq("name", name);
  }
}
