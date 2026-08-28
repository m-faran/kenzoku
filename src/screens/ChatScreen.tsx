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
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-border bg-white">
          <Pressable onPress={() => navigation.goBack()} className="mr-3 active:opacity-70">
            <Ionicons name="arrow-back" size={24} color="#18181B" />
          </Pressable>
          
          <Pressable 
            className="flex-1 flex-row items-center"
            onPress={() => navigation.getParent()?.navigate("PersonProfile", { personId })}
          >
            {person && <Avatar uri={person.photo_url} size={40} />}
            <View className="flex-1 ml-3">
              <Text className="text-foreground font-body-semi text-base" numberOfLines={1}>
                {person?.name ?? "Loading..."}
              </Text>
              <Text className="text-online font-body text-xs">Online</Text>
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
            className="active:opacity-70"
          >
            <Ionicons name="ellipsis-horizontal" size={22} color="#71717A" />
          </Pressable>
        </View>

        {/* Shared interests banner */}
        {shared.length > 0 && (
          <View className="px-4 py-2.5 bg-surface border-b border-border">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="text-muted font-body text-xs">Shared interests:</Text>
              {shared.map((id) => (
                <InterestChip
                  key={id}
                  label={getInterestLabel(id)}
                  emoji={getInterestEmoji(id)}
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
            <ActivityIndicator size="large" color="#7C3AED" />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={visibleMessages}
            keyExtractor={(m) => m.id}
            className="flex-1 px-4"
            contentContainerStyle={{ paddingVertical: 16, gap: 8 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            renderItem={({ item: msg }) => {
              const fromMe = msg.sender_id === authUser?.id;
              const time = new Date(msg.created_at);
              const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              return (
                <View className={`max-w-[78%] ${fromMe ? "self-end" : "self-start"}`}>
                  <View
                    className={`rounded-2xl px-4 py-3 ${
                      fromMe
                        ? "bg-primary rounded-br-sm"
                        : "bg-surface border border-border rounded-bl-sm"
                    }`}
                  >
                    <Text
                      className={`font-body text-sm leading-relaxed ${
                        fromMe ? "text-white" : "text-foreground"
                      }`}
                    >
                      {msg.text}
                    </Text>
                  </View>
                  <Text className={`text-muted font-body text-xs mt-1 ${fromMe ? "text-right" : "text-left"}`}>
                    {timeStr}
                  </Text>
                </View>
              );
            }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-muted font-body text-sm">
                  No messages yet. Say hello! 👋
                </Text>
              </View>
            }
          />
        )}

        {/* Privacy notice */}
        <View className="px-4 py-1">
          <Text className="text-muted font-body text-xs text-center">
            Chats are encrypted in transit.
          </Text>
        </View>

        {/* Composer / Blocked Message */}
        {isBlocked ? (
          <View className="flex-row items-center justify-center px-4 py-5 bg-surface border-t border-border">
            <Text className="text-muted font-body-semi text-base">You blocked this user</Text>
          </View>
        ) : (
          <View className="flex-row items-center px-4 py-3 bg-white border-t border-border gap-2">

            <View className="flex-1 bg-surface border border-border rounded-2xl px-4 py-2.5">
              <TextInput
                className="text-foreground font-body text-base"
                placeholder="Message..."
                placeholderTextColor="#A1A1AA"
                value={text}
                onChangeText={setText}
                multiline
              />
            </View>
            <Pressable
              onPress={send}
              className={`w-10 h-10 rounded-full items-center justify-center active:opacity-80 ${
                text.trim() ? "bg-primary" : "bg-border"
              }`}
            >
              <Ionicons name="send" size={16} color="#fff" />
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
