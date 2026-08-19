import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ChatsStackParamList } from "../navigation/stacks/ChatsStack";
import ChatRow from "../components/ChatRow";
import { CHAT_THREADS, getPersonById } from "../data/mockData";

type Nav = NativeStackNavigationProp<ChatsStackParamList, "Chats">;

export default function ChatsScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState("");

  const threads = CHAT_THREADS.map((t) => ({
    thread: t,
    person: getPersonById(t.personId)!,
  })).filter(
    ({ person }) =>
      !search || person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-foreground font-display text-2xl mb-4">Chats</Text>
        <View className="flex-row items-center bg-white border border-border rounded-xl px-4 py-3 gap-2">
          <Ionicons name="search" size={18} color="#A1A1AA" />
          <TextInput
            className="flex-1 text-foreground font-body text-base"
            placeholder="Search conversations..."
            placeholderTextColor="#A1A1AA"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={threads}
        keyExtractor={({ thread }) => thread.personId}
        renderItem={({ item: { person, thread } }) => (
          <ChatRow
            person={person}
            thread={thread}
            onPress={() => navigation.navigate("Chat", { personId: person.id })}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-px bg-border mx-5" />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text style={{ fontSize: 40 }} className="mb-3">💬</Text>
            <Text className="text-foreground font-body-semi text-lg">No chats yet</Text>
            <Text className="text-muted font-body text-sm text-center mt-1 px-8">
              Connect with people to start conversations
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-white"
      />
    </SafeAreaView>
  );
}
