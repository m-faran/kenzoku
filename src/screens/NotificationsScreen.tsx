import React from "react";
import { View, Text, SectionList, SafeAreaView } from "react-native";
import NotificationItem from "../components/NotificationItem";
import { NOTIFICATIONS, Notification } from "../data/mockData";

export default function NotificationsScreen() {
  const unread = NOTIFICATIONS.filter((n) => !n.read);
  const read = NOTIFICATIONS.filter((n) => n.read);

  const sections = [
    ...(unread.length > 0 ? [{ title: "New", data: unread }] : []),
    ...(read.length > 0 ? [{ title: "Earlier", data: read }] : []),
  ];

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-5 pt-4 pb-3">
        <Text className="text-foreground font-display text-2xl">Notifications</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        className="flex-1 bg-white"
        renderSectionHeader={({ section: { title } }) => (
          <View className="px-5 py-2.5 bg-surface border-b border-border">
            <Text className="text-muted font-body-semi text-xs uppercase tracking-wider">
              {title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        ItemSeparatorComponent={() => <View className="h-px bg-border mx-5" />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text style={{ fontSize: 40 }} className="mb-3">🔔</Text>
            <Text className="text-foreground font-body-semi text-lg">No notifications yet</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
