import { supabase } from "../supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export type MessageRow = {
  id: string;
  channel_id: string;
  sender_id: string;
  text: string;
  created_at: string;
};

export type ChannelWithDetails = {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  other_user: {
    id: string;
    name: string;
    photo_url: string;
  };
  last_message: {
    text: string;
    created_at: string;
    sender_id: string;
  } | null;
  is_blocked?: boolean;
};

/**
 * Find an existing channel between two users, or create one.
 * Sorts IDs so user1_id < user2_id to avoid duplicate channels.
 */
export async function findOrCreateChannel(userId: string, otherUserId: string): Promise<string> {
  const [user1, user2] = [userId, otherUserId].sort();

  // Try to find existing
  const { data: existing } = await supabase
    .from("chat_channels")
    .select("id")
    .eq("user1_id", user1)
    .eq("user2_id", user2)
    .single();

  if (existing) return existing.id;

  // Create new
  const { data, error } = await supabase
    .from("chat_channels")
    .insert({ user1_id: user1, user2_id: user2 })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

/**
 * Fetch all chat channels for a user, with the other user's profile and last message.
 */
export async function fetchChannels(userId: string): Promise<ChannelWithDetails[]> {
  const { data, error } = await supabase
    .from("chat_channels")
    .select(`
      id, user1_id, user2_id, created_at,
      user1:profiles!user1_id(id, name, photo_url),
      user2:profiles!user2_id(id, name, photo_url)
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  if (error) throw error;

  // For each channel, fetch the latest message
  const channels: ChannelWithDetails[] = [];
  for (const ch of data ?? []) {
    const otherUser = (ch.user1 as any).id === userId ? ch.user2 : ch.user1;

    const { data: lastMsg } = await supabase
      .from("messages")
      .select("text, created_at, sender_id")
      .eq("channel_id", ch.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const { data: blockData } = await supabase
      .from("blocks")
      .select("id")
      .match({ blocker_id: userId, blocked_id: (otherUser as any).id })
      .maybeSingle();

    channels.push({
      id: ch.id,
      user1_id: ch.user1_id,
      user2_id: ch.user2_id,
      created_at: ch.created_at,
      other_user: otherUser as any,
      last_message: lastMsg ?? null,
      is_blocked: !!blockData,
    });
  }

  // Sort by last message time (channels with messages first)
  channels.sort((a, b) => {
    const aTime = a.last_message?.created_at ?? a.created_at;
    const bTime = b.last_message?.created_at ?? b.created_at;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return channels;
}

export async function fetchMessages(channelId: string): Promise<MessageRow[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function sendMessage(channelId: string, senderId: string, text: string): Promise<MessageRow> {
  const { data, error } = await supabase
    .from("messages")
    .insert({ channel_id: channelId, sender_id: senderId, text })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Subscribe to new messages in a channel via Supabase Realtime.
 * Returns the RealtimeChannel so caller can unsubscribe.
 */
export function subscribeToMessages(
  channelId: string,
  onNewMessage: (msg: MessageRow) => void
): RealtimeChannel {
  return supabase
    .channel(`messages:${channelId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `channel_id=eq.${channelId}`,
      },
      (payload) => {
        onNewMessage(payload.new as MessageRow);
      }
    )
    .subscribe();
}
