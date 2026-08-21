import { supabase } from "../supabase";

export type NotificationRow = {
  id: string;
  user_id: string;
  type: "connection" | "message" | "discovery" | "shared";
  text: string;
  read: boolean;
  avatar_url: string | null;
  reference_id: string | null;
  created_at: string;
};

export async function fetchNotifications(userId: string): Promise<NotificationRow[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function markNotificationRead(notificationId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
  if (error) throw error;
}

export async function insertNotification(
  userId: string,
  notification: { type: NotificationRow["type"]; text: string; avatar_url?: string; reference_id?: string }
) {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    ...notification,
  });
  if (error) throw error;
}
