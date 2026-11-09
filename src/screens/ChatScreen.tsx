import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ChatsStackParamList } from "../navigation/stacks/ChatsStack";
import Avatar from "../components/Avatar";
import InterestChip from "../components/InterestChip";
import { getSharedInterests, getInterestLabel, getInterestEmoji } from "../data/mockData";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { useMessages, useSendMessage } from "../hooks/useChat";
import { useBlockStatus, useToggleBlock } from "../hooks/useBlocks";
import { fetchMyProfile } from "../lib/api/profiles";
import { useQuery } from "@tanstack/react-query";

type Props = NativeStackScreenProps<ChatsStackParamList, "Chat">;

export default function ChatScreen({ route, navigation }: Props) {
  const { channelId, personId } = route.params;
  const { user } = useUser();
  const { user: authUser } = useAuth();
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);

  // Fetch the other person's profile
  const { data: person } = useQuery({
    queryKey: ["profile", personId],
    queryFn: () => fetchMyProfile(personId),
    enabled: !!personId,
  });

  // Messages with Realtime subscription
  const { data: messages = [], isLoading } = useMessages(channelId);
  const { mutate: sendMsg } = useSendMessage();

  // Block status
  const { data: isBlocked } = useBlockStatus(personId);
  const { mutate: toggleBlock } = useToggleBlock(personId, !!isBlocked);

  const shared = person?.interests
    ? getSharedInterests(person.interests, user.interests)
    : [];

  const send = () => {
    if (!text.trim()) return;
    sendMsg(
      { channelId, text: text.trim() },
      {
        onError: () => {
          Alert.alert("Cannot Send", "You cannot reply to this conversation.");
        },
      }
    );
    setText("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  if (!person && !isLoading) return null;

  // Filter out incoming messages if we blocked them (frontend safeguard)
  const visibleMessages = isBlocked
    ? messages.filter((m) => m.sender_id === authUser?.id)
    : messages;

  return (
    <View className="flex-1 bg-surface">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-border bg-surface">
          <Pressable onPress={() => navigation.goBack()} className="mr-3 w-8 h-8 bg-card border border-ink items-center justify-center active:opacity-70">
            <Ionicons name="arrow-back" size={16} color="#111111" />
          </Pressable>
          
          <Pressable 
            className="flex-1 flex-row items-center"
            onPress={() => navigation.getParent()?.navigate("PersonProfile", { personId })}
          >
            {person && <Avatar uri={person.photo_url} size={36} />}
            <View className="flex-1 ml-2.5">
              <Text className="text-ink font-body-bold text-xs uppercase tracking-[1.5px]" numberOfLines={1}>
                {person?.name ?? "Loading..."}
              </Text>
              <View className="flex-row items-center gap-1.5 mt-0.5">
                <View className="w-1.5 h-1.5 bg-online" />
                <Text className="text-muted font-body-semi text-[9px] uppercase tracking-[1.2px]">ACTIVE CHANNEL</Text>
              </View>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              Alert.alert(
                "Options",
                isBlocked ? "Unblock this user?" : "Block this user?",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: isBlocked ? "Unblock" : "Block", 
                    style: isBlocked ? "default" : "destructive",
                    onPress: () => toggleBlock()
                  }
                ]
              );
            }}
            className="w-8 h-8 bg-card border border-border items-center justify-center active:opacity-70"
          >
            <Ionicons name="ellipsis-horizontal" size={16} color="#111111" />
          </Pressable>
        </View>

        {/* Shared interests banner */}
        {shared.length > 0 && (
          <View className="px-4 py-2 bg-card border-b border-border">
            <View className="flex-row items-center gap-1.5 flex-wrap">
              <Text className="text-muted font-body-bold text-[9px] uppercase tracking-[1.5px] mr-1">
                SHARED:
              </Text>
              {shared.map((id) => (
                <InterestChip
                  key={id}
                  label={getInterestLabel(id)}
                  variant="shared"
                  small
                />
              ))}
            </View>
          </View>
        )}

        {/* Messages */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#FF3B1D" />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={visibleMessages}
            keyExtractor={(m) => m.id}
            className="flex-1 px-4"
            contentContainerStyle={{ paddingVertical: 16, gap: 10 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            renderItem={({ item: msg }) => {
              const fromMe = msg.sender_id === authUser?.id;
              const time = new Date(msg.created_at);
              const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              return (
                <View className={`max-w-[80%] ${fromMe ? "self-end" : "self-start"}`}>
                  <View
                    className={`px-3.5 py-2.5 border ${
                      fromMe
                        ? "bg-ink border-ink"
                        : "bg-card border-ink"
                    }`}
                  >
                    <Text
                      className={`font-body text-xs leading-[18px] ${
                        fromMe ? "text-card" : "text-ink"
                      }`}
                    >
                      {msg.text}
                    </Text>
                  </View>
                  <Text className={`text-muted font-body-semi text-[9px] uppercase tracking-[1px] mt-1 ${fromMe ? "text-right" : "text-left"}`}>
                    {timeStr}
                  </Text>
                </View>
              );
            }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20 px-8">
                <View className="w-2 h-2 bg-primary mb-2" />
                <Text className="text-ink font-body-bold text-xs uppercase tracking-[2px] text-center mb-1">
                  CHANNEL OPEN
                </Text>
                <Text className="text-muted font-body text-xs text-center leading-[18px]">
                  Say hello to initiate your exchange.
                </Text>
              </View>
            }
          />
        )}

        {/* Privacy notice */}
        <View className="px-4 py-1.5 border-t border-border bg-surface">
          <Text className="text-muted font-body-semi text-[9px] uppercase tracking-[1.5px] text-center">
            Direct channel · Encrypted in transit
          </Text>
        </View>

        {/* Composer / Blocked Message */}
        {isBlocked ? (
          <View className="flex-row items-center justify-center px-4 py-4 bg-paper-sunken border-t border-border">
            <Text className="text-muted font-body-bold text-xs uppercase tracking-[2px]">
              You blocked this user
            </Text>
          </View>
        ) : (
          <View className="flex-row items-stretch px-4 py-3 bg-surface border-t border-ink gap-2">
            <View className="flex-1 bg-card border border-ink px-3 py-2.5 justify-center">
              <TextInput
                className="text-ink font-body text-xs"
                placeholder="MESSAGE..."
                placeholderTextColor="#A8A29E"
                value={text}
                onChangeText={setText}
                multiline
              />
            </View>
            <Pressable
              onPress={send}
              className={`w-12 items-center justify-center border border-ink active:opacity-85 ${
                text.trim() ? "bg-primary" : "bg-card"
              }`}
            >
              <Ionicons name="arrow-forward" size={16} color={text.trim() ? "#FCFBF7" : "#111111"} />
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
