import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ProfileStackParamList } from "../navigation/stacks/ProfileStack";
import Avatar from "../components/Avatar";
import InterestChip from "../components/InterestChip";
import SettingsRow from "../components/SettingsRow";
import Button from "../components/Button";
import { MY_INTERESTS, getInterestLabel, getInterestEmoji } from "../data/mockData";

type Nav = NativeStackNavigationProp<ProfileStackParamList, "Profile">;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();

  const menuItems = [
    {
      icon: "star" as const,
      label: "My Interests",
      onPress: () => {},
    },
    {
      icon: "settings" as const,
      label: "Settings",
      onPress: () => navigation.navigate("Settings"),
    },
    {
      icon: "notifications" as const,
      label: "Notifications",
      onPress: () => {},
    },
    {
      icon: "shield-checkmark" as const,
      label: "Privacy & Safety",
      onPress: () => navigation.navigate("PrivacySafety"),
    },
    {
      icon: "ban" as const,
      label: "Blocked People",
      iconColor: "#EF4444",
      onPress: () => {},
    },
    {
      icon: "help-circle" as const,
      label: "Help & Support",
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="items-center px-6 pt-8 pb-6">
          <Avatar
            uri="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&auto=format"
            size={88}
          />
          <Text className="text-foreground font-display text-2xl mt-4 mb-0.5">Alex Rivera</Text>
          <Text className="text-muted font-body text-sm mb-1">📍 San Francisco</Text>
          <Text className="text-muted font-body text-sm text-center mt-2 leading-relaxed px-4">
            Builder and chess obsessive. Working on dev tools for distributed teams.
          </Text>
        </View>

        {/* Interests */}
        <View className="px-6 mb-6">
          <Text className="text-foreground font-body-semi text-sm mb-3">My Interests</Text>
          <View className="flex-row flex-wrap gap-2">
            {MY_INTERESTS.map((id) => (
              <InterestChip
                key={id}
                label={getInterestLabel(id)}
                emoji={getInterestEmoji(id)}
                variant="selected"
              />
            ))}
          </View>
        </View>

        {/* Edit Profile */}
        <View className="px-6 mb-6">
          <Button
            label="Edit Profile"
            variant="secondary"
            onPress={() => navigation.navigate("EditProfile")}
          />
        </View>

        {/* Menu */}
        <View className="bg-white rounded-2xl mx-4 mb-4 overflow-hidden">
          {menuItems.map((item, i) => (
            <React.Fragment key={item.label}>
              <SettingsRow
                icon={item.icon}
                label={item.label}
                iconColor={item.iconColor ?? "#7C3AED"}
                onPress={item.onPress}
              />
              {i < menuItems.length - 1 && (
                <View className="h-px bg-border ml-16" />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Log Out */}
        <View className="px-4 mb-8">
          <Pressable
            onPress={() => Alert.alert("Log Out", "Are you sure?", [
              { text: "Cancel", style: "cancel" },
              { text: "Log Out", style: "destructive" },
            ])}
            className="bg-white rounded-2xl px-5 py-4 items-center active:opacity-80"
          >
            <Text className="text-danger font-body-semi text-base">Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
