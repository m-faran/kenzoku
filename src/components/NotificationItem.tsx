import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "./Avatar";
import { NotificationRow } from "../lib/api/notifications";

const iconMap: Record<NotificationRow["type"], { name: keyof typeof Ionicons.glyphMap }> = {
  connection: { name: "person-add-outline" },
  message: { name: "chatbubble-outline" },
  discovery: { name: "compass-outline" },
  shared: { name: "star-outline" },
};

type Props = {
  notification: NotificationRow;
};

export default function NotificationItem({ notification }: Props) {
  const icon = iconMap[notification.type];

  return (
    <View
      className={`flex-row items-center px-4 py-3.5 border-b border-border ${
        notification.read ? "bg-card" : "bg-surface"
      }`}
    >
      {notification.avatar_url ? (
        <Avatar uri={notification.avatar_url} size={40} />
      ) : (
        <View className="w-10 h-10 border border-ink bg-card items-center justify-center">
          <Ionicons name={icon.name} size={18} color="#111111" />
        </View>
      )}
      <View className="flex-1 ml-3.5">
        <Text className="text-ink font-body text-xs leading-[17px]">{notification.text}</Text>
        <Text className="text-muted font-body-semi text-[9px] uppercase tracking-[1.5px] mt-1">
          {new Date(notification.created_at).toLocaleDateString()}
        </Text>
      </View>
      {!notification.read && (
        <View className="w-1.5 h-1.5 bg-primary ml-2" />
      )}
    </View>
  );
}
