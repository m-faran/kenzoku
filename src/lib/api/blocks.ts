import { supabase } from "../supabase";

export async function blockUser(blockerId: string, blockedId: string) {
  const { error } = await supabase
    .from("blocks")
    .insert({ blocker_id: blockerId, blocked_id: blockedId });
  if (error) throw error;
}

export async function unblockUser(blockerId: string, blockedId: string) {
  const { error } = await supabase
    .from("blocks")
    .delete()
    .match({ blocker_id: blockerId, blocked_id: blockedId });
  if (error) throw error;
}

export async function fetchIsBlocked(blockerId: string, blockedId: string) {
  const { data, error } = await supabase
    .from("blocks")
    .select("id")
    .match({ blocker_id: blockerId, blocked_id: blockedId })
    .maybeSingle();
  if (error) throw error;
  return !!data;
}
