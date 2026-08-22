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
      className="flex-row items-center px-5 py-4 bg-white active:bg-surface"
    >
      <Avatar uri={other_user.photo_url} size={52} />
      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between mb-0.5">
          <Text className="text-foreground font-body-semi text-base">{other_user.name}</Text>
          {last_message && (
            <Text className="text-muted font-body text-xs">
              {formatTime(last_message.created_at)}
            </Text>
          )}
        </View>
        <Text
          className={`flex-1 text-sm font-body ${channel.is_blocked ? "text-muted italic" : "text-muted"}`}
          numberOfLines={1}
        >
          {channel.is_blocked ? "You blocked this user" : (last_message?.text ?? "No messages yet")}
        </Text>
      </View>
    </Pressable>
  );
}
