import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ChatsStackParamList } from "../navigation/stacks/ChatsStack";
import Avatar from "../components/Avatar";
import InterestChip from "../components/InterestChip";
import {
  CHAT_THREADS,
  getPersonById,
  getSharedInterests,
  getInterestLabel,
  getInterestEmoji,
  ChatMessage,
} from "../data/mockData";

type Props = NativeStackScreenProps<ChatsStackParamList, "Chat">;

export default function ChatScreen({ route, navigation }: Props) {
  const person = getPersonById(route.params.personId);
  const thread = CHAT_THREADS.find((t) => t.personId === route.params.personId);

  const [messages, setMessages] = useState<ChatMessage[]>(thread?.messages ?? []);
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);

  if (!person) return null;

  const shared = getSharedInterests(person.interests);

  const send = () => {
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      text: text.trim(),
      fromMe: true,
      timestamp: "Now",
    };
    setMessages((prev) => [...prev, msg]);
    setText("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-border bg-white">
          <Pressable onPress={() => navigation.goBack()} className="mr-3 active:opacity-70">
            <Ionicons name="arrow-back" size={24} color="#18181B" />
          </Pressable>
          <Avatar uri={person.photo} size={40} online />
          <View className="flex-1 ml-3">
            <Text className="text-foreground font-body-semi text-base">{person.name}</Text>
            <Text className="text-online font-body text-xs">Online</Text>
          </View>
          <Pressable
            onPress={() => Alert.alert("Options", "Report or Block")}
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
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingVertical: 16, gap: 8 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item: msg }) => (
            <View
              className={`max-w-[78%] ${msg.fromMe ? "self-end" : "self-start"}`}
            >
              <View
                className={`rounded-2xl px-4 py-3 ${
                  msg.fromMe
                    ? "bg-primary rounded-br-sm"
                    : "bg-surface border border-border rounded-bl-sm"
                }`}
              >
                <Text
                  className={`font-body text-sm leading-relaxed ${
                    msg.fromMe ? "text-white" : "text-foreground"
                  }`}
                >
                  {msg.text}
                </Text>
              </View>
              <Text className={`text-muted font-body text-xs mt-1 ${msg.fromMe ? "text-right" : "text-left"}`}>
                {msg.timestamp}
              </Text>
            </View>
          )}
        />

        {/* Privacy notice */}
        <View className="px-4 py-1">
          <Text className="text-muted font-body text-xs text-center">
            Chats are encrypted in transit.
          </Text>
        </View>

        {/* Composer */}
        <View className="flex-row items-center px-4 py-3 bg-white border-t border-border gap-2">
          <Pressable
            onPress={() => Alert.alert("Attachments", "Photo\nImage\nFile")}
            className="active:opacity-70"
          >
            <Ionicons name="attach" size={24} color="#71717A" />
          </Pressable>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
