import React, { useState, useCallback } from "react";
import { View, Text, SectionList, SafeAreaView, ActivityIndicator, RefreshControl } from "react-native";
import NotificationItem from "../components/NotificationItem";
import PendingConnectionItem from "../components/PendingConnectionItem";
import { useNotifications } from "../hooks/useNotifications";
import { usePendingConnections } from "../hooks/useConnections";
import { NotificationRow } from "../lib/api/notifications";

export default function NotificationsScreen() {
  const { data: notifications = [], isLoading: loadingNotifs, refetch: refetchNotifs } = useNotifications();
  const { data: pending = [], isLoading: loadingPending, refetch: refetchPending } = usePendingConnections();
  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchNotifs(), refetchPending()]);
    setRefreshing(false);
  }, [refetchNotifs, refetchPending]);
  
  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  const sections = [
    ...(pending.length > 0 ? [{ title: "Pending Requests", data: pending, isPending: true }] : []),
    ...(unread.length > 0 ? [{ title: "New", data: unread, isPending: false }] : []),
    ...(read.length > 0 ? [{ title: "Earlier", data: read, isPending: false }] : []),
  ];

  const isLoading = loadingNotifs || loadingPending;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-5 pt-4 pb-3">
        <Text className="text-foreground font-display text-2xl">Notifications</Text>
      </View>

      {isLoading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : (
        <SectionList
          sections={sections}
        keyExtractor={(item) => item.id}
        className="flex-1 bg-white"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />
        }
        renderSectionHeader={({ section: { title } }) => (
          <View className="px-5 py-2.5 bg-surface border-b border-border">
            <Text className="text-muted font-body-semi text-xs uppercase tracking-wider">
              {title}
            </Text>
          </View>
        )}
        renderItem={({ item, section }) => {
          if ((section as any).isPending) {
            return <PendingConnectionItem connection={item} />;
          }
          return <NotificationItem notification={item} />;
        }}
        ItemSeparatorComponent={() => <View className="h-px bg-border mx-5" />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text style={{ fontSize: 40 }} className="mb-3">🔔</Text>
            <Text className="text-foreground font-body-semi text-lg">No notifications yet</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
