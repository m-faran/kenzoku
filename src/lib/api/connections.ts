import { supabase } from "../supabase";
import { findOrCreateChannel } from "./chat";

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
  });

  // Also create a notification for the sender
  await supabase.from("notifications").insert({
    user_id: senderId,
    type: "connection" as const,
    text: "Connection request sent!",
  });

  return data;
}

export async function respondToConnection(connectionId: string, status: "accepted" | "rejected") {
  // Fetch the connection first so we know sender/receiver
  const { data: conn, error: fetchErr } = await supabase
    .from("connections")
    .select("sender_id, receiver_id")
    .eq("id", connectionId)
    .single();
  if (fetchErr) throw fetchErr;

  const { error } = await supabase
    .from("connections")
    .update({ status })
    .eq("id", connectionId);
  if (error) throw error;

  // Auto-create chat channel when connection is accepted
  if (status === "accepted" && conn) {
    await findOrCreateChannel(conn.sender_id, conn.receiver_id);
  }
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

export async function fetchConnectionStatus(userId: string, otherId: string) {
  // Check direction 1
  const { data: data1, error: err1 } = await supabase
    .from("connections")
    .select("status")
    .match({ sender_id: userId, receiver_id: otherId })
    .maybeSingle();

  if (err1) throw err1;
  if (data1) return data1.status as "pending" | "accepted" | "rejected";

  // Check direction 2
  const { data: data2, error: err2 } = await supabase
    .from("connections")
    .select("status")
    .match({ sender_id: otherId, receiver_id: userId })
    .maybeSingle();

  if (err2) throw err2;
  if (data2) return data2.status as "pending" | "accepted" | "rejected";

  return "none";
}
