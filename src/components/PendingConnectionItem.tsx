import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Avatar from "./Avatar";
import { useRespondToConnection } from "../hooks/useConnections";
import { RootStackParamList } from "../navigation/RootNavigator";

type Props = {
  connection: any; // Contains sender info joined from profiles
};

export default function PendingConnectionItem({ connection }: Props) {
  const { mutate: respond, isPending } = useRespondToConnection();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const sender = connection.sender;

  if (!sender) return null;

  return (
    <View className="flex-row items-center px-5 py-4 bg-white border-b border-border">
      <Pressable 
        className="flex-row items-center flex-1"
        onPress={() => navigation.navigate("PersonProfile", { personId: sender.id })}
      >
        <Avatar uri={sender.photo_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"} size={48} />
        <View className="flex-1 ml-3 mr-2">
          <Text className="text-foreground font-body-semi text-base" numberOfLines={1}>{sender.name}</Text>
          <Text className="text-muted font-body text-sm mt-0.5">wants to connect</Text>
        </View>
      </Pressable>
      
      {isPending ? (
        <View className="px-4 py-2">
          <ActivityIndicator size="small" color="#7C3AED" />
        </View>
      ) : (
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => respond({ connectionId: connection.id, status: "rejected" })}
            className="px-3 py-1.5 rounded-full bg-surface border border-border"
          >
            <Text className="text-muted font-body-semi text-sm">Reject</Text>
          </Pressable>
          <Pressable
            onPress={() => respond({ connectionId: connection.id, status: "accepted" })}
            className="px-3 py-1.5 rounded-full bg-primary"
          >
            <Text className="text-white font-body-semi text-sm">Accept</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
