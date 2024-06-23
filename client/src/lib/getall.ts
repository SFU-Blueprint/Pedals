import supabase from "@/lib/supabase";

export default async function getAll() {
  const { data } = await supabase.from("volunteers_test").select("name, hours");
  return data;
}
