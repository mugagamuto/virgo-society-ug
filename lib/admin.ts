import { supabase } from "@/lib/supabase";

export async function isAdmin(): Promise<boolean> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id;
  if (!uid) return false;

  const { data, error } = await supabase.rpc("is_admin", { uid });
  if (error) return false;
  return Boolean(data);
}