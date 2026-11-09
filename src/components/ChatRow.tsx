import React from "react";
import { View, Text, Pressable } from "react-native";
import Avatar from "./Avatar";
import { ChannelWithDetails } from "../lib/api/chat";

type Props = {
  channel: ChannelWithDetails;
  onPress?: () => void;
};

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Now";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d`;
}

export default function ChatRow({ channel, onPress }: Props) {
  const { other_user, last_message } = channel;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3.5 bg-card active:bg-paper-sunken border-b border-border"
    >
      <Avatar uri={other_user.photo_url} size={48} />
      <View className="flex-1 ml-3.5">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-ink font-body-bold text-xs uppercase tracking-[1.5px]" numberOfLines={1}>
            {other_user.name}
          </Text>
          {last_message && (
            <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[1.5px]">
              {formatTime(last_message.created_at)}
            </Text>
          )}
        </View>
        <Text
          className={`text-xs font-body leading-[17px] ${
            channel.is_blocked ? "text-muted italic" : "text-muted"
          }`}
          numberOfLines={1}
        >
          {channel.is_blocked ? "Blocked dispatch" : (last_message?.text ?? "No messages exchanged yet")}
        </Text>
      </View>
    </Pressable>
  );
}
