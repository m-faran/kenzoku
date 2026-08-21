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

  // Fetch IDs of people we've already sent a connection to (any status)
  const { data: sent, error: sErr } = await supabase
    .from("connections")
    .select("receiver_id")
    .eq("sender_id", userId);
  if (sErr) throw sErr;

  const sentIds = new Set((sent ?? []).map((c) => c.receiver_id));
  return (profiles ?? []).filter((p) => !sentIds.has(p.id));
}
