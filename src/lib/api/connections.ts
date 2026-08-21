import { supabase } from "../supabase";

export async function sendConnection(senderId: string, receiverId: string) {
  const { data, error } = await supabase
    .from("connections")
    .insert({ sender_id: senderId, receiver_id: receiverId })
    .select()
    .single();
  if (error) throw error;

  // Also create a notification for the receiver
  await supabase.from("notifications").insert({
    user_id: receiverId,
    type: "connection" as const,
    text: "Someone sent you a connection request",
    // We'll fill avatar_url from the sender's profile
  });

  return data;
}

export async function respondToConnection(connectionId: string, status: "accepted" | "rejected") {
  const { error } = await supabase
    .from("connections")
    .update({ status })
    .eq("id", connectionId);
  if (error) throw error;
}

export async function fetchConnections(userId: string) {
  const { data, error } = await supabase
    .from("connections")
    .select("*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq("status", "accepted");
  if (error) throw error;
  return data ?? [];
}

export async function fetchPendingForMe(userId: string) {
  const { data, error } = await supabase
    .from("connections")
    .select("*, sender:profiles!sender_id(*)")
    .eq("receiver_id", userId)
    .eq("status", "pending");
  if (error) throw error;
  return data ?? [];
}
