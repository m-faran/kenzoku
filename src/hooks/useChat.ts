import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchChannels,
  fetchMessages,
  sendMessage,
  subscribeToMessages,
  ChannelWithDetails,
  MessageRow,
} from "../lib/api/chat";
import { useAuth } from "../context/AuthContext";

export function useChannels() {
  const { user: authUser } = useAuth();
  return useQuery({
    queryKey: ["channels", authUser?.id],
    queryFn: () => fetchChannels(authUser!.id),
    enabled: !!authUser?.id,
  });
}

export function useMessages(channelId: string | undefined) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["messages", channelId],
    queryFn: () => fetchMessages(channelId!),
    enabled: !!channelId,
  });

  // Realtime subscription — append new messages to cache
  useEffect(() => {
    if (!channelId) return;

    const channel = subscribeToMessages(channelId, (newMsg) => {
      qc.setQueryData<MessageRow[]>(["messages", channelId], (old) => {
        if (!old) return [newMsg];
        // Avoid duplicates (optimistic update may have already added it)
        if (old.some((m) => m.id === newMsg.id)) return old;
        return [...old, newMsg];
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [channelId, qc]);

  return query;
}

export function useSendMessage() {
  const { user: authUser } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, text }: { channelId: string; text: string }) => {
      if (!authUser?.id) throw new Error("Not authenticated");
      return sendMessage(channelId, authUser.id, text);
    },
    onSuccess: (newMsg) => {
      // Optimistically append to message list
      qc.setQueryData<MessageRow[]>(["messages", newMsg.channel_id], (old) => {
        if (!old) return [newMsg];
        if (old.some((m) => m.id === newMsg.id)) return old;
        return [...old, newMsg];
      });
      // Refresh channel list (updates last message preview)
      qc.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}
