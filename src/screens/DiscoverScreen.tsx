import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Alert, ActivityIndicator } from "react-native";
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
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text className="text-muted font-body text-sm mt-3">Finding your people...</Text>
      </SafeAreaView>
    );
  }

  if (ranked.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center px-8">
        <Text style={{ fontSize: 48 }} className="mb-4">🔍</Text>
        <Text className="text-foreground font-display text-xl text-center mb-2">No one to discover yet</Text>
        <Text className="text-muted font-body text-sm text-center">
          Check back later — new people join every day!
        </Text>
      </SafeAreaView>
    );
  }

  const person = ranked[currentIndex % ranked.length];

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
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="px-2 mb-6">
          <Text className="text-foreground font-display text-2xl">Find Your People</Text>
          <Text className="text-muted font-body text-sm mt-0.5">
            People who share your interests
          </Text>
        </View>

        {/* Stacked cards */}
        <View className="flex-1 items-center">
          {/* Background card (next) */}
          <View
            className="absolute rounded-3xl bg-white"
            style={{
              top: 10,
              width: "92%",
              height: "90%",
              opacity: 0.5,
              transform: [{ scale: 0.96 }],
            }}
          />

          {/* Main card */}
          <PersonCard
            person={person}
            onConnect={handleConnect}
            onPass={handlePass}
            onPress={() => navigation.navigate("PersonProfile", { personId: person.id })}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
