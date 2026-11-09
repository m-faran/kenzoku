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
    <View className="flex-row items-center px-4 py-3.5 bg-card border-b border-border">
      <Pressable 
        className="flex-row items-center flex-1 mr-2"
        onPress={() => navigation.navigate("PersonProfile", { personId: sender.id })}
      >
        <Avatar uri={sender.photo_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"} size={44} />
        <View className="flex-1 ml-3 mr-2">
          <Text className="text-ink font-body-bold text-xs uppercase tracking-[1.5px]" numberOfLines={1}>{sender.name}</Text>
          <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[1.2px] mt-0.5">REQUESTED CONNECTION</Text>
        </View>
      </Pressable>
      
      {isPending ? (
        <View className="px-4 py-2">
          <ActivityIndicator size="small" color="#FF3B1D" />
        </View>
      ) : (
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => respond({ connectionId: connection.id, status: "rejected" })}
            className="px-3 py-2 bg-surface border border-ink items-center justify-center active:opacity-70"
          >
            <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[1.5px]">Pass</Text>
          </Pressable>
          <Pressable
            onPress={() => respond({ connectionId: connection.id, status: "accepted" })}
            className="px-3.5 py-2 bg-primary border border-ink items-center justify-center active:opacity-85"
          >
            <Text className="text-card font-body-bold text-[10px] uppercase tracking-[1.5px]">Accept</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
