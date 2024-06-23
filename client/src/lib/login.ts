// src/api/login.ts
import supabase from "@/lib/supabase";

export default async function login(name: string) {
  // Check if the user exists
  const { data: user } = await supabase
    .from("volunteers_test")
    .select("*")
    .eq("name", name)
    .single();

  if (!user) {
    const { data: newUser } = await supabase
      .from("volunteers_test")
      .insert({ name })
      .single();
    return newUser;
  }
  return user;
}
