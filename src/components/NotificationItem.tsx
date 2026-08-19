import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "./Avatar";
import { Notification } from "../data/mockData";

const iconMap: Record<Notification["type"], { name: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  connection: { name: "person-add", color: "#7C3AED", bg: "#EDE9FE" },
  message: { name: "chatbubble", color: "#7C3AED", bg: "#EDE9FE" },
  discovery: { name: "compass", color: "#F59E0B", bg: "#FEF3C7" },
  shared: { name: "star", color: "#F59E0B", bg: "#FEF3C7" },
};

type Props = {
  notification: Notification;
};

export default function NotificationItem({ notification }: Props) {
  const icon = iconMap[notification.type];

  return (
    <View
      className={`flex-row items-center px-5 py-4 ${notification.read ? "bg-white" : "bg-surface"}`}
    >
      {notification.avatarUrl ? (
        <Avatar uri={notification.avatarUrl} size={44} />
      ) : (
        <View
          className="rounded-full items-center justify-center"
          style={{ width: 44, height: 44, backgroundColor: icon.bg }}
        >
          <Ionicons name={icon.name} size={20} color={icon.color} />
        </View>
      )}
      <View className="flex-1 ml-3">
        <Text className="text-foreground font-body-medium text-sm">{notification.text}</Text>
        <Text className="text-muted font-body text-xs mt-0.5">{notification.timestamp}</Text>
      </View>
      {!notification.read && (
        <View className="w-2 h-2 bg-primary rounded-full ml-2" />
      )}
    </View>
  );
}
