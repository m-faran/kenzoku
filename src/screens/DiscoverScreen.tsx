import React, { useState, useEffect } from "react";
import { View, Text, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DiscoverStackParamList } from "../navigation/stacks/DiscoverStack";
import PersonCard from "../components/PersonCard";
import { useUser } from "../context/UserContext";
import { useDiscoverProfiles } from "../hooks/useDiscoverProfiles";
import { useSendConnection } from "../hooks/useConnections";

type Nav = NativeStackNavigationProp<DiscoverStackParamList, "Discover">;

export default function DiscoverScreen() {
  const navigation = useNavigation<Nav>();
  const { user, loading: isUserLoading } = useUser();
  const { data: ranked = [], isLoading, refetch } = useDiscoverProfiles();
  const sendConnection = useSendConnection();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isUserLoading && user && !user.name) {
      // If profile is incomplete, force them to set it up
      navigation.replace("ProfileSetup" as any);
    }
  }, [user.name, isUserLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#FF3B1D" />
        <Text className="text-muted font-body-semi text-[11px] uppercase tracking-[2px] mt-4">
          Indexing kindred profiles...
        </Text>
      </View>
    );
  }

  if (ranked.length === 0) {
    return (
      <View className="flex-1 bg-surface justify-between px-6 py-10">
        <View className="flex-row items-center justify-between border-b border-border pb-3">
          <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
            KENZOKU
          </Text>
          <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[2px]">
            00 MATCHES
          </Text>
        </View>

        <View>
          <Text
            className="text-ink font-display uppercase"
            style={{ fontSize: 56, lineHeight: 52, letterSpacing: -2 }}
          >
            QUIET{"\n"}HORIZON
          </Text>
          <Text className="text-muted font-body text-[13px] leading-[20px] mt-4 max-w-[280px]">
            No new profiles match your current passion index yet. Check back soon as new members join.
          </Text>
        </View>

        <View className="border-t border-border pt-4 flex-row items-center justify-between">
          <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[1.8px]">
            STATUS: STANDBY
          </Text>
          <View className="w-2 h-2 bg-primary" />
        </View>
      </View>
    );
  }

  const activeIdx = currentIndex % ranked.length;
  const person = ranked[activeIdx];

  const handlePass = () => setCurrentIndex((i) => i + 1);
  const handleConnect = () => {
    sendConnection.mutate(person.id, {
      onSuccess: () => {
        Alert.alert("Connected!", `You've sent a connection request to ${person.name}.`);
        setCurrentIndex((i) => i + 1);
        refetch();
      },
      onError: (err: any) => {
        Alert.alert("Error", err.message ?? "Failed to send connection request");
      },
    });
  };

  return (
    <View className="flex-1 bg-surface">
      {/* Top editorial bar — tiny scale */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 bg-primary" />
          <Text className="text-ink font-body-bold text-[11px] uppercase tracking-[2.2px]">
            KENZOKU
          </Text>
        </View>
        <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[1.8px]">
          {user.city ? `${user.city} · ` : ""}
          {String(activeIdx + 1).padStart(2, "0")} / {String(ranked.length).padStart(2, "0")}
        </Text>
      </View>

      {/* Deck stage */}
      <View className="flex-1 items-center justify-center px-3.5 py-2">
        {/* Background depth plane (next card shadow sheet) */}
        {ranked.length > 1 && (
          <View
            className="absolute bg-paper-sunken border border-ink"
            style={{
              width: "94%",
              height: "92%",
              transform: [{ translateY: 10 }, { translateX: 6 }],
            }}
          />
        )}

        {/* Main 3-plane card */}
        <PersonCard
          person={person}
          onConnect={handleConnect}
          onPass={handlePass}
          onPress={() => navigation.navigate("PersonProfile", { personId: person.id })}
        />
      </View>
    </View>
  );
}
