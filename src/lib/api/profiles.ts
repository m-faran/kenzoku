import { supabase } from "../supabase";

export type ProfileRow = {
  id: string;
  name: string;
  bio: string;
  city: string;
  school: string;
  photo_url: string;
  motive: string;
  specific_interests: string;
  interests: string[];
  age: number | null;
  created_at: string;
  updated_at: string;
};

export async function fetchMyProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error && error.code === "PGRST116") return null; // not found
  if (error) throw error;
  return data;
}

export async function upsertProfile(
  userId: string,
  profile: Partial<Omit<ProfileRow, "id" | "created_at" | "updated_at">>
) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...profile, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data as ProfileRow;
}

export async function fetchDiscoverProfiles(userId: string): Promise<ProfileRow[]> {
  // Fetch all profiles except self
  const { data: profiles, error: pErr } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", userId);
  if (pErr) throw pErr;

  // Fetch connections in both directions
  const { data: connections, error: cErr } = await supabase
    .from("connections")
    .select("sender_id, receiver_id")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
  if (cErr) throw cErr;

  // Fetch blocked users (RLS allows seeing who we blocked)
  const { data: blocks, error: bErr } = await supabase
    .from("blocks")
    .select("blocked_id")
    .eq("blocker_id", userId);
  if (bErr) throw bErr;

  const excludeIds = new Set<string>();
  
  for (const c of connections ?? []) {
    excludeIds.add(c.sender_id === userId ? c.receiver_id : c.sender_id);
  }
  for (const b of blocks ?? []) {
    excludeIds.add(b.blocked_id);
  }

  return (profiles ?? []).filter((p) => !excludeIds.has(p.id));
}
