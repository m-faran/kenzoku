import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ChatsStackParamList } from "../navigation/stacks/ChatsStack";
import ChatRow from "../components/ChatRow";
import { useChannels } from "../hooks/useChat";

type Nav = NativeStackNavigationProp<ChatsStackParamList, "Chats">;

export default function ChatsScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState("");
  const { data: channels = [], isLoading } = useChannels();

  const filtered = channels.filter(
    (ch) =>
      !search || ch.other_user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-surface">
      {/* Top technical metadata bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 bg-primary" />
          <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
            DISPATCH INDEX
          </Text>
        </View>
        <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[1.8px]">
          {String(channels.length).padStart(2, "0")} CHANNELS
        </Text>
      </View>

      {/* Header */}
      <View className="px-4 pt-3 pb-4">
        <Text
          className="text-ink font-display uppercase mb-3"
          style={{ fontSize: 52, lineHeight: 48, letterSpacing: -2 }}
        >
          CHATS
        </Text>
        <View className="flex-row items-center bg-card border border-ink px-3.5 py-2.5 gap-2">
          <Ionicons name="search" size={15} color="#111111" />
          <TextInput
            className="flex-1 text-ink font-body text-xs"
            placeholder="SEARCH DISPATCHES..."
            placeholderTextColor="#A8A29E"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF3B1D" />
          <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[2px] mt-3">
            Loading channels...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(ch) => ch.id}
          renderItem={({ item: channel }) => (
            <ChatRow
              channel={channel}
              onPress={() =>
                navigation.navigate("Chat", {
                  channelId: channel.id,
                  personId: channel.other_user.id,
                })
              }
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-24 px-8">
              <View className="w-2 h-2 bg-primary mb-3" />
              <Text className="text-ink font-display uppercase text-2xl text-center mb-1">
                NO DISPATCHES
              </Text>
              <Text className="text-muted font-body text-xs text-center leading-[18px]">
                Connect with kindred spirits on Discover to open instantaneous direct channels.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          className="flex-1 bg-surface"
        />
      )}
    </View>
  );
}
