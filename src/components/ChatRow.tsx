import React from "react";
import { View, Text, Pressable } from "react-native";
import Avatar from "./Avatar";
import { Person, ChatThread, getSharedInterests, getInterestLabel } from "../data/mockData";
import { useUser } from "../context/UserContext";

type Props = {
  person: Person;
  thread: ChatThread;
  onPress?: () => void;
};

export default function ChatRow({ person, thread, onPress }: Props) {
  const { user } = useUser();
  const shared = getSharedInterests(person.interests, user.interests);

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-5 py-4 bg-white active:bg-surface"
    >
      <Avatar uri={person.photo} size={52} />
      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between mb-0.5">
          <Text className="text-foreground font-body-semi text-base">{person.name}</Text>
          <Text className="text-muted font-body text-xs">{thread.lastMessageTime}</Text>
        </View>
        {shared.length > 0 && (
          <Text className="text-primary font-body-medium text-xs mb-1">
            {shared.map(getInterestLabel).join(" · ")}
          </Text>
        )}
        <View className="flex-row items-center justify-between">
          <Text
            className={`flex-1 text-sm font-body ${thread.unread > 0 ? "text-foreground font-body-medium" : "text-muted"}`}
            numberOfLines={1}
          >
            {thread.lastMessage}
          </Text>
          {thread.unread > 0 && (
            <View className="bg-primary rounded-full w-5 h-5 items-center justify-center ml-2">
              <Text className="text-white text-xs font-body-semi">{thread.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
