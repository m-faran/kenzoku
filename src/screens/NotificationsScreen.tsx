import React, { useState, useCallback } from "react";
import { View, Text, SectionList, ActivityIndicator, RefreshControl } from "react-native";
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
    <View className="flex-1 bg-surface">
      {/* Top technical bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 bg-primary" />
          <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
            ACTIVITY LOG
          </Text>
        </View>
        <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[1.8px]">
          {String(notifications.length).padStart(2, "0")} NOTICES
        </Text>
      </View>

      <View className="px-4 pt-3 pb-3">
        <Text
          className="text-ink font-display uppercase"
          style={{ fontSize: 46, lineHeight: 42, letterSpacing: -2 }}
        >
          NOTICES
        </Text>
      </View>

      {isLoading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF3B1D" />
          <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[2px] mt-3">
            Loading activity...
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          className="flex-1 bg-surface"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF3B1D" />
          }
          renderSectionHeader={({ section: { title } }) => (
            <View className="px-4 py-2 bg-paper-sunken border-y border-border">
              <Text className="text-ink font-body-bold text-[9px] uppercase tracking-[2px]">
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
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-24 px-8">
              <View className="w-2 h-2 bg-primary mb-3" />
              <Text className="text-ink font-display uppercase text-2xl text-center mb-1">
                QUIET LOG
              </Text>
              <Text className="text-muted font-body text-xs text-center leading-[18px]">
                No pending requests or notices at this time.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
