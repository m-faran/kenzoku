import React, { useState, useMemo } from "react";
import { View, Text, SafeAreaView, Alert, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DiscoverStackParamList } from "../navigation/stacks/DiscoverStack";
import PersonCard from "../components/PersonCard";
import { PEOPLE } from "../data/mockData";
import { rankPeopleByCompatibility } from "../data/matchingAlgorithm";
import { useUser } from "../context/UserContext";
import { useNotifications } from "../context/NotificationContext";

type Nav = NativeStackNavigationProp<DiscoverStackParamList, "Discover">;

export default function DiscoverScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useUser();
  const { addNotification } = useNotifications();
  const [currentIndex, setCurrentIndex] = useState(0);

  const ranked = useMemo(
    () => rankPeopleByCompatibility(PEOPLE, user.interests, user.specificInterests),
    [user.interests, user.specificInterests]
  );

  const person = ranked[currentIndex % ranked.length];

  const handlePass = () => setCurrentIndex((i) => i + 1);
  const handleConnect = () => {
    addNotification({
      type: "connection",
      text: `You sent a connection request to ${person.name}`,
      timestamp: "Just now",
      read: false,
      avatarUrl: person.photo,
    });
    Alert.alert("Connected!", `You've sent a connection request to ${person.name}.`);
    setCurrentIndex((i) => i + 1);
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
