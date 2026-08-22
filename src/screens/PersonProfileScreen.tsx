import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { DiscoverStackParamList } from "../navigation/stacks/DiscoverStack";
import InterestChip from "../components/InterestChip";
import Button from "../components/Button";
import {
  getSharedInterests,
  getInterestLabel,
  getInterestEmoji,
} from "../data/mockData";
import { useUser } from "../context/UserContext";
import { useSendConnection, useConnectionStatus } from "../hooks/useConnections";
import { useBlockStatus, useToggleBlock } from "../hooks/useBlocks";
import { fetchMyProfile, ProfileRow } from "../lib/api/profiles";
import { supabase } from "../lib/supabase";

type Props = NativeStackScreenProps<DiscoverStackParamList, "PersonProfile">;

const { width: W } = Dimensions.get("window");
const PHOTO_HEIGHT = W * 1.05;

export default function PersonProfileScreen({ route, navigation }: Props) {
  const { user } = useUser();
  const sendConnection = useSendConnection();
  const { data: connectionStatus } = useConnectionStatus(route.params.personId);
  const { data: isBlocked } = useBlockStatus(route.params.personId);
  const { mutate: toggleBlock } = useToggleBlock(route.params.personId, !!isBlocked);

  const { data: person, isLoading } = useQuery({
    queryKey: ["profile", route.params.personId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", route.params.personId)
        .single();
      if (error) throw error;
      return data as ProfileRow;
    },
  });

  const [didRequestConnection, setDidRequestConnection] = React.useState(false);

  if (isLoading || !person) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const shared = getSharedInterests(person.interests ?? [], user.interests);
  const personInterests = person.interests ?? [];

  const handleConnect = () => {
    if (sendConnection.isPending || didRequestConnection) return;
    setDidRequestConnection(true);

    sendConnection.mutate(person.id, {
      onSuccess: () => {
        Alert.alert("Connected!", `You've sent a connection request to ${person.name}.`);
      },
      onError: (err: any) => {
        setDidRequestConnection(false);
        Alert.alert("Error", err.message ?? "Failed to send connection request");
      },
    });
  };

  const isActuallyPending = connectionStatus === "pending" || didRequestConnection;

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* Photo header */}
        <View style={{ height: PHOTO_HEIGHT }}>
          <Image
            source={{ uri: person.photo_url }}
            style={{ width: W, height: PHOTO_HEIGHT }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent", "transparent"]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120 }}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200 }}
          />

          {/* Back button */}
          <Pressable
            onPress={() => navigation.goBack()}
            className="absolute top-14 left-5 w-10 h-10 bg-white/20 rounded-full items-center justify-center active:opacity-70"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>

          {/* Name overlay */}
          <View className="absolute bottom-6 left-6 right-6">
            <Text className="text-white font-display text-3xl mb-0.5">
              {person.name}{person.age ? `, ${person.age}` : ""}
            </Text>
            <Text className="text-white/80 font-body text-base">
              📍 {person.city}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 pt-6 pb-10">
          {/* Bio */}
          <Text className="text-foreground font-body text-base leading-relaxed mb-6">
            {person.bio}
          </Text>

          {/* Motive */}
          {person.motive ? (
            <View className="bg-accent/10 border border-accent/20 rounded-2xl p-4 mb-6 items-center">
              <Text className="text-accent font-body-semi text-xs text-center uppercase tracking-wider mb-1">Motive</Text>
              <Text className="text-foreground font-body text-sm text-center">"{person.motive}"</Text>
            </View>
          ) : null}

          {/* Shared interests */}
          {shared.length > 0 && (
            <View className="bg-accent/10 border border-accent/30 rounded-2xl p-4 mb-6">
              <View className="flex-row items-center gap-2 mb-3">
                <Text style={{ fontSize: 18 }}>✨</Text>
                <Text className="text-foreground font-body-semi text-base">You both like</Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {shared.map((id) => (
                  <InterestChip
                    key={id}
                    label={getInterestLabel(id)}
                    emoji={getInterestEmoji(id)}
                    variant="shared"
                  />
                ))}
              </View>
            </View>
          )}

          {/* All interests */}
          <Text className="text-foreground font-body-semi text-base mb-3">
            All interests
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-8">
            {personInterests.map((id) => (
              <InterestChip
                key={id}
                label={getInterestLabel(id)}
                emoji={getInterestEmoji(id)}
                variant={shared.includes(id) ? "shared" : "default"}
              />
            ))}
          </View>

          {/* Connect */}
          {(connectionStatus === "none" || connectionStatus === "rejected") && !isActuallyPending && (
            <Button
              label={`Connect with ${person.name}`}
              onPress={handleConnect}
              disabled={sendConnection.isPending || didRequestConnection}
            />
          )}

          {isActuallyPending && (
            <View className="bg-surface border border-border rounded-xl py-3.5 items-center">
              <Text className="text-foreground font-body-semi text-base">Request Pending</Text>
            </View>
          )}

          {(connectionStatus === "accepted") && !isActuallyPending && (
            <View className="bg-surface border border-border rounded-xl py-3.5 items-center">
              <Text className="text-foreground font-body-semi text-base">You are connected</Text>
            </View>
          )}

          {/* Safety actions */}
          <View className="flex-row justify-center gap-6 mt-5">
            <Pressable
              onPress={() => Alert.alert("Report", "Thanks for keeping the community safe.")}
              className="active:opacity-70"
            >
              <Text className="text-muted font-body text-sm">Report</Text>
            </Pressable>
            <Text className="text-border">•</Text>
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Options",
                  isBlocked ? `Unblock ${person.name}?` : `Block ${person.name}?`,
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
              <Text className="text-muted font-body text-sm">{isBlocked ? "Unblock" : "Block"}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
